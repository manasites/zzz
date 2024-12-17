import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
   Disclosure,
   DisclosureButton,
   DisclosurePanel,
} from "@headlessui/react";
import { Button } from "~/components/Button";
import { Fragment, useState } from "react";
import clsx from "clsx";

import { H2 } from "~/components/Headers";
import { Icon } from "~/components/Icon";

export function SkillMaterials({ data: char }: { data: any }) {
   //@ts-ignore

   const skill_list = char.skills;

   return (
      <>
         <div
            dangerouslySetInnerHTML={{
               __html: `<style>
                    div.zzz-rarity-1 {
                        border-bottom: 4px solid #7DA89B;
                    }
                    div.zzz-rarity-2 {
                        border-bottom: 4px solid #00A9FF;
                    }
                    div.zzz-rarity-3 {
                        border-bottom: 4px solid #E900FF;
                    }
                    div.zzz-rarity-4 {
                        border-bottom: 4px solid #FFBA05;
                    }
                    div.zzz-rarity-5 {
                        border-bottom: 4px solid #FFBA05;
                    }
                  </style>`,
            }}
         ></div>

         <H2>Skill Materials</H2>
         <SkillTotalMaterials skill_list={skill_list} />

         <AccordionFullMaterials skill_list={skill_list} />
      </>
   );
}

const SkillTotalMaterials = ({ skill_list }: any) => {
   const skillData = skill_list?.[0]?.materials;
   let skillTotal = CalculateTotals(skillData);

   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow className="text-sm">
                  <TableHeader center className="!py-1">
                     Materials Per Skill
                  </TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {skillTotal?.length > 0 ? (
                  <TableRow>
                     <TableCell center className="!py-1">
                        {/* @ts-ignore */}
                        {skillTotal?.map((mat, key) => (
                           <ItemQtyFrame mat={mat} key={key} />
                        ))}
                     </TableCell>
                  </TableRow>
               ) : null}
            </TableBody>
         </Table>
      </>
   );
};

const AccordionFullMaterials = ({ skill_list }: any) => {
   return (
      <Disclosure>
         {({ open }) => (
            <>
               <DisclosureButton
                  className="my-3 flex justify-between items-center gap-4 font-bold w-full p-2 rounded-lg bg-zinc-50
                dark:bg-zinc-700 dark:border-zinc-600 border-zinc-300 shadow-1 shadow-sm border border-color-sub"
               >
                  <div
                     className={clsx(
                        open ? "transform rotate-180" : "",
                        "dark:bg-zinc-600 bg-white rounded-full size-7 flex items-center justify-center",
                     )}
                  >
                     <Icon size={20} name="chevron-down" />
                  </div>
                  <span>Full Materials Per Level</span>
                  <div
                     className={clsx(
                        open ? "transform rotate-180" : "",
                        "dark:bg-zinc-600 bg-white rounded-full size-7 flex items-center justify-center",
                     )}
                  >
                     <Icon size={20} name="chevron-down" />
                  </div>
               </DisclosureButton>
               <DisclosurePanel className="space-y-3">
                  <SkillTabs skill_list={skill_list} />
               </DisclosurePanel>
            </>
         )}
      </Disclosure>
   );
};

const SkillTabs = ({ skill_list }: any) => {
   const [selectedIndex, setSelectedIndex] = useState(0);
   return (
      <>
         <div className="shadow-sm dark:shadow-zinc-800/60 bg-clip-padding border-y tablet:border border-color-sub tablet:rounded-xl max-w-[754px] mx-auto max-tablet:-mx-3">
            <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
               <TabList
                  className="relative flex bg-zinc-50 dark:bg-dark350 scrollbar
                            dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450
                            scrollbar-thumb-zinc-300 scrollbar-track-zinc-100
                              overflow-auto border-b border-color-sub p-3 items-center gap-3 tablet:rounded-t-xl"
               >
                  {skill_list?.map((skill, index) => {
                     return (
                        <Tab key={"skill_materials_" + index} as={Fragment}>
                           {({ selected }) => (
                              //@ts-ignore
                              <Button
                                 color={selected ? "dark/white" : undefined}
                                 plain={selected ? undefined : true}
                                 className={clsx(
                                    !selected &&
                                       "bg-zinc-200/50 dark:shadow-none dark:bg-dark450",
                                    "!py-1.5 !px-3 flex-none",
                                 )}
                              >
                                 {skill.skill_type?.name}
                              </Button>
                           )}
                        </Tab>
                     );
                  })}
               </TabList>
               <TabPanels className="p-3">
                  {skill_list?.map((skill, index) => (
                     <TabPanel key={"skill_materials_" + index} unmount={false}>
                        <MaterialTable data={skill.materials} />
                     </TabPanel>
                  ))}
               </TabPanels>
            </TabGroup>
         </div>
      </>
   );
};

const MaterialTable = ({ data }: any) => {
   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow className="text-sm">
                  <TableHeader center>Lvl</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {data?.map((promo, index) => {
                  return (
                     <>
                        {promo.materials?.length > 0 ? (
                           <TableRow key={index}>
                              <TableCell center className="!py-1">
                                 <div>{index + 1}</div>
                              </TableCell>
                              <TableCell className="!py-1">
                                 {/* @ts-ignore */}
                                 {promo.materials?.map((mat, key) => (
                                    <ItemQtyFrame mat={mat} key={key} />
                                 ))}
                              </TableCell>
                           </TableRow>
                        ) : null}
                     </>
                  );
               })}
            </TableBody>
         </Table>
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
type ItemQtyFrameProps = {
   material?: any;
   qty?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information
   const cnt = parseInt(mat?.qty);
   const display_qty =
      cnt > 999999
         ? Math.round(cnt / 1000000) + "M"
         : cnt > 999
         ? Math.round(cnt / 1000) + "k"
         : cnt;

   return (
      <div
         className="relative inline-block text-center mr-1 bg-black rounded-md"
         key={mat?.id}
      >
         <a href={`/c/materials/${mat.material?.id}`}>
            <div
               className={`relative flex justify-center p-0.5 h-10 w-10 align-middle text-xs bg-zinc-700 text-white text-xs leading-none rounded-md zzz-rarity-${mat.material?.rarity?.id}`}
            >
               <Image
                  height={36}
                  className="object-contain"
                  url={mat.material?.icon?.url ?? "no_image_42df124128"}
                  options="height=36"
                  alt={mat.material?.name}
               />
            </div>

            <div
               className={`relative w-10 align-middle text-xs text-white rounded-b-md `}
            >
               {display_qty}
            </div>
         </a>
      </div>
   );
};

function CalculateTotals(matlist: any) {
   let matTotal = [];

   if (matlist && matlist?.length > 0) {
      for (let i = 0; i < matlist?.length; i++) {
         const material_qty = matlist?.[i]?.materials;
         if (!material_qty) break;
         for (let j = 0; j < material_qty.length; j++) {
            const currMat = { ...material_qty?.[j] };
            const existIndex = matTotal.findIndex(
               (a) => a.material?.id == currMat.material?.id,
            );
            if (existIndex == -1) {
               matTotal.push(currMat);
            } else {
               matTotal[existIndex].qty += currMat.qty;
            }
         }
      }
   }

   return matTotal;
}
