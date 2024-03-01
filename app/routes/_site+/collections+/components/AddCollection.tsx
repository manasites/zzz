import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useZorm } from "react-zorm";
import { toast } from "sonner";
import urlSlug from "url-slug";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import { Field, Label } from "~/components/Fieldset";
import { Input } from "~/components/Input";
import type { Site } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { isAdding, isProcessing } from "~/utils/form";

import { CollectionSchema } from "../../c_+/$collectionId_.$entryId/utils/CollectionSchema";

export function AddCollection({
   site,
   setDnDCollections,
}: {
   site: Site;
   setDnDCollections: (collections: any) => void;
}) {
   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "addCollection");

   const zoCollection = useZorm("newCollection", CollectionSchema);

   const disabled = isProcessing(fetcher.state);

   // Reset the form after submission
   useEffect(() => {
      if (!adding) {
         setCollectionName("");
         setCollectionSlug("");
         setDnDCollections(site.collections);
      }
   }, [adding, site.collections]);

   const [collectionName, setCollectionName] = useState("");
   const [collectionSlug, setCollectionSlug] = useState("");

   return (
      <AdminOrStaffOrOwner>
         <fetcher.Form
            onSubmit={(e) => {
               const validation = zoCollection.validate();
               if (!validation.success) {
                  zoCollection.errors.name((err) => toast.error(err.message));
                  zoCollection.errors.slug((err) => toast.error(err.message));
                  e.preventDefault();
               }
            }}
            ref={zoCollection.ref}
            className={clsx(
               collectionName
                  ? "shadow-sm shadow-1 mb-3 bg-zinc-50 dark:bg-dark400 border dark:border-zinc-600/40 p-4 rounded-xl"
                  : "tablet:flex",
               "mb-6 tablet:mb-4 max-tablet:space-y-4  items-center gap-4",
            )}
            method="POST"
            action="/collections"
         >
            <div className="tablet:flex items-center gap-6 max-tablet:space-y-6 flex-grow">
               <Field
                  disabled={disabled}
                  className="tablet:flex items-center gap-4 flex-none flex-grow"
               >
                  <Label className={clsx(collectionName ? "" : "hidden")}>
                     Name
                  </Label>
                  <Input
                     disabled={disabled}
                     placeholder="Type a collection name..."
                     name={zoCollection.fields.name()}
                     type="text"
                     value={collectionName}
                     className="tablet:!mt-0"
                     onChange={(e) => {
                        setCollectionName(e.target.value);
                        setCollectionSlug(urlSlug(e.target.value));
                     }}
                  />
               </Field>
               {collectionName && (
                  <div className="flex-none">
                     <Field className="tablet:flex gap-2 items-baseline justify-center">
                        <Label>Slug</Label>
                        <Input
                           disabled={disabled}
                           className="flex-none !w-auto !text-xs !focus:outline-none tablet:!mt-0"
                           name={zoCollection.fields.slug()}
                           value={collectionSlug}
                           onChange={(e) => {
                              setCollectionSlug(e.target.value);
                           }}
                           type="text"
                        />
                     </Field>
                     <input
                        value={site.id}
                        name={zoCollection.fields.siteId()}
                        type="hidden"
                     />
                  </div>
               )}
            </div>
            <div
               className={clsx(
                  collectionName &&
                     "flex items-center justify-end pt-3 tablet:pt-4",
               )}
            >
               <Button
                  className="max-tablet:w-full w-32 h-11 tablet:h-9"
                  name="intent"
                  value="addCollection"
                  type="submit"
                  color="blue"
                  disabled={disabled}
               >
                  {adding ? <DotLoader /> : "Add Collection"}
               </Button>
            </div>
         </fetcher.Form>
      </AdminOrStaffOrOwner>
   );
}
