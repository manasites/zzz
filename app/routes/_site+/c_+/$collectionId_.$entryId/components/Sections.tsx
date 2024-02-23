import { useState, useEffect } from "react";

import { useFetcher, useLocation, useParams } from "@remix-run/react";
import clsx from "clsx";
import type { Zorm } from "react-zorm";
import { useValue, useZorm } from "react-zorm";
import urlSlug from "url-slug";
import { z } from "zod";

import { Button } from "~/components/Button";
import { Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { Switch, SwitchField } from "~/components/Switch";
import { isAdding } from "~/utils/form";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { CollectionEdit } from "./CollectionEdit";
import { SectionList } from "./SectionList";

export type Section = {
   id: string;
   slug: string;
   name?: string;
   showTitle?: boolean;
   showAd?: boolean;
   subSections?: [{ id: string; slug: string; name: string; type: string }];
};

export const SectionSchema = z.object({
   collectionId: z.string(),
   name: z.string(),
   sectionSlug: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Section Id contains invalid characters",
      ),
   showTitle: z.coerce.boolean(),
   showAd: z.coerce.boolean(),
   type: z.enum(["editor", "customTemplate", "qna", "comments"]),
});

export function Sections() {
   const { site } = useSiteLoaderData();
   const fetcher = useFetcher({ key: "section" });
   //Get path for custom site
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];
   const collectionId = useParams()?.collectionId ?? collectionSlug;

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   //Sections
   const zoSections = useZorm("sections", SectionSchema);
   const addingSection = isAdding(fetcher, "addSection");

   const [isSectionsOpen, setSectionsOpen] = useState<boolean>(false);

   const sections = collection?.sections?.map((item) => item.id) ?? [];

   useEffect(() => {
      if (!addingSection) {
         zoSections.refObject.current && zoSections.refObject.current.reset();
      }
   }, [addingSection, zoSections.refObject]);

   return (
      <div className="relative">
         <div className="flex items-center gap-3 absolute -top-8 right-0 z-10">
            <button
               onClick={() => setSectionsOpen(!isSectionsOpen)}
               className="flex items-center dark:hover:border-zinc-400/50 gap-2 justify-center shadow-1 shadow-sm h-7 
             dark:bg-dark450 bg-white rounded-lg border border-zinc-200 dark:border-zinc-500/60 hover:border-zinc-300/80 overflow-hidden"
            >
               <div className="flex items-center gap-1.5 h-full">
                  <div className="text-[10px] font-bold text-1 pl-2.5">
                     Sections
                  </div>
                  <Icon
                     name="chevron-down"
                     className={clsx(
                        isSectionsOpen ? "rotate-180" : "",
                        "transform transition duration-300 text-1 ease-in-out",
                     )}
                     size={14}
                  />
                  <div
                     className="text-[10px] font-bold border-l border-zinc-200 dark:border-zinc-600 
                     h-full text-1 bg-zinc-50 flex items-center justify-center dark:bg-dark400 px-2"
                  >
                     {sections?.length}
                  </div>
               </div>
            </button>
            {/* @ts-ignore */}
            <CollectionEdit collection={collection} />
         </div>
         {/* Sections */}
         {isSectionsOpen && (
            <div className="pt-2">
               <fetcher.Form
                  ref={zoSections.ref}
                  className="shadow-sm shadow-1 gap-4 border border-color dark:border-zinc-600/50 rounded-lg bg-zinc-50 dark:bg-dark400 p-4 mb-4"
                  method="post"
                  action="/collections/sections"
               >
                  <div className="max-laptop:space-y-3 laptop:flex items-center pb-5 justify-between gap-5">
                     <Field className="w-full">
                        <Label className="flex items-center justify-between gap-4">
                           <span>Name</span>
                           <SectionIdField zo={zoSections} />
                        </Label>
                        <Input
                           className="w-full"
                           required
                           placeholder="Type a section name..."
                           name={zoSections.fields.name()}
                           type="text"
                        />
                     </Field>
                     <Field className="laptop:min-w-40">
                        <Label>Type</Label>
                        <Select name={zoSections.fields.type()}>
                           <option value="editor">Editor</option>
                           <option value="customTemplate">
                              Custom Template
                           </option>
                           <option value="qna">Q&A</option>
                           <option value="comments">Comments</option>
                        </Select>
                     </Field>
                     <input
                        value={collection?.id}
                        name={zoSections.fields.collectionId()}
                        type="hidden"
                     />
                  </div>
                  <div className="max-laptop:space-y-6 laptop:flex items-center justify-end gap-6">
                     <div className="flex items-center justify-end gap-8">
                        <SwitchField>
                           <Label className="!text-xs text-1">Show Ad</Label>
                           <Switch
                              value="true"
                              color="dark/white"
                              name={zoSections.fields.showAd()}
                           />
                        </SwitchField>
                        <SwitchField>
                           <Label className="!text-xs text-1">Show Title</Label>
                           <Switch
                              defaultChecked
                              value="true"
                              color="dark/white"
                              name={zoSections.fields.showTitle()}
                           />
                        </SwitchField>
                     </div>
                     <div className="max-laptop:flex items-center justify-end">
                        <Button
                           className="text-sm cursor-pointer mr-0 ml-auto block"
                           name="intent"
                           value="addSection"
                           type="submit"
                        >
                           {addingSection ? (
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin text-white"
                              />
                           ) : (
                              <Icon
                                 name="plus"
                                 className="text-white"
                                 size={14}
                              />
                           )}
                           Add Section
                        </Button>
                     </div>
                  </div>
               </fetcher.Form>
               <SectionList collection={collection} />
            </div>
         )}
      </div>
   );
}

export function SectionIdField({ zo }: { zo: Zorm<typeof SectionSchema> }) {
   const value = useValue({
      zorm: zo,
      name: zo.fields.name(),
   });
   return (
      <>
         {value && (
            <div className="flex items-center justify-end gap-1.5">
               <div className="text-1 text-xs">Slug</div>
               <input
                  readOnly
                  name={zo.fields.sectionSlug()}
                  type="text"
                  className="bg-transparent focus:bg-3 focus:border-0 focus:ring-0 
                  p-0 text-zinc-400 dark:text-zinc-500 font-normal text-xs outline-none"
                  value={urlSlug(value)}
               />
            </div>
         )}
      </>
   );
}
