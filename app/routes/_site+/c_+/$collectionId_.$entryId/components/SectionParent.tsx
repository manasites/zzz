import { Fragment } from "react";

import { Popover, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Collection } from "~/db/payload-types";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import type { Flatten } from "./Section";
import { SectionTitle } from "./SectionTitle";
// eslint-disable-next-line import/no-cycle
import { SubSection } from "./SubSection";
import { SubSectionTabs } from "./SubSectionTabs";
import { TableOfContents } from "../../_components/TableOfContents";

export function SectionParent({
   section,
   sections,
   customData,
   customComponents,
   entry,
   activeSection,
   hasAccess,
}: {
   section: Flatten<Collection["sections"]>;
   sections: Collection["sections"];
   customData: unknown;
   customComponents: unknown;
   entry: SerializeFrom<typeof entryLoaderType>["entry"];
   activeSection: string | null;
   hasAccess: Boolean;
}) {
   if (sections && section?.subSections) {
      const isSingle =
         section?.subSections && section?.subSections?.length == 1;

      const isActiveSection = activeSection === section?.slug;

      const activeSectionName = sections?.find(
         (element) => isActiveSection && element.slug === activeSection,
      )?.name;

      const activeSectionIndex = sections?.findIndex(
         (element) => isActiveSection && element.slug === activeSection,
      );

      const prevToCItem =
         sections[
            (activeSectionIndex + sections?.length - 1) % sections?.length
         ];

      const nextToCItem = sections[(activeSectionIndex + 1) % sections?.length];

      const showToBottomArrow = activeSectionIndex == 0;

      const showToTopArrow = activeSectionIndex == sections?.length - 1;

      return (
         <>
            {isActiveSection && (
               <div
                  className="fixed top-[117px] left-0  max-tablet:px-3 laptop:top-[61px] bg-3-sub laptop:shadow-sm shadow-1 px-2.5 py-2 laptop:pb-3 laptop:pt-3.5
                  flex items-center w-full z-50 laptop:z-30 max-laptop:py-3 mx-auto  border-y laptop:border-t-0 dark:border-zinc-600/50"
               >
                  <div className="flex items-center w-full justify-between laptop:ml-36 desktop:ml-[300px] laptop:mr-80">
                     <div className="flex items-center gap-2.5">
                        <Popover>
                           {({ open }) => (
                              <>
                                 <Popover.Button className="w-6 h-6 dark:bg-dark450 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-dark500 flex items-center justify-center rounded-md">
                                    {open ? (
                                       <Icon
                                          name="chevron-left"
                                          className="text-1"
                                          size={14}
                                       />
                                    ) : (
                                       <Icon
                                          name="list"
                                          size={16}
                                          className="text-1"
                                       />
                                    )}
                                 </Popover.Button>
                                 <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                 >
                                    <Popover.Panel className="absolute w-full mt-3.5 laptop:mt-5 drop-shadow-xl left-0 transform">
                                       <div className="flex items-center justify-center laptop:pl-[138px] desktop:pl-[306px] laptop:pr-[340px]">
                                          <TableOfContents
                                             entry={entry}
                                             sections={sections}
                                          />
                                       </div>
                                    </Popover.Panel>
                                 </Transition>
                              </>
                           )}
                        </Popover>
                        <div className="font-bold text-sm">
                           {activeSectionName}
                        </div>
                     </div>
                     {isActiveSection && (
                        <div className="flex items-center gap-1 laptop:pr-4">
                           <Tooltip setDelay={1000} placement="top">
                              <TooltipTrigger title="Next Section" asChild>
                                 <Link
                                    to={`#${prevToCItem?.id}`}
                                    className="p-1.5 block rounded-md hover:bg-zinc-100 dark:hover:bg-dark450"
                                 >
                                    <Icon
                                       name={
                                          showToBottomArrow
                                             ? "chevrons-down"
                                             : "arrow-up"
                                       }
                                       size={16}
                                       className="text-1"
                                    />
                                 </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                 {showToBottomArrow ? "To Last" : "To Previous"}
                              </TooltipContent>
                           </Tooltip>
                           <Tooltip setDelay={1000} placement="top">
                              <TooltipTrigger title="Previous Section" asChild>
                                 <Link
                                    to={`#${nextToCItem?.id}`}
                                    className="p-1.5 block rounded-md hover:bg-zinc-100 dark:hover:bg-dark450"
                                 >
                                    <Icon
                                       name={
                                          showToTopArrow
                                             ? "chevrons-up"
                                             : "arrow-down"
                                       }
                                       size={16}
                                       className="text-1"
                                    />
                                 </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                 {showToTopArrow ? "To First" : "To Next"}
                              </TooltipContent>
                           </Tooltip>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {isSingle ? (
               <div
                  data-section
                  id={section?.slug ?? ""}
                  className="scroll-mt-32 laptop:scroll-mt-[126px] max-w-[728px] mx-auto"
               >
                  <SectionTitle section={section} />
                  <SubSection
                     //@ts-ignore
                     subSection={section?.subSections[0]}
                     customData={customData}
                     customComponents={customComponents}
                  />
               </div>
            ) : (
               <SubSectionTabs
                  section={section}
                  entry={entry}
                  customData={customData}
                  customComponents={customComponents}
               />
            )}
         </>
      );
   }
}
