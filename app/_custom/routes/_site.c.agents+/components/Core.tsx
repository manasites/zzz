import { useState } from "react";

import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function Core({ data: char }: { data: AgentType }) {
   const core = {
      id: char?.core_skill?.skill_type?.name,
      icon: char?.core_skill?.skill_type?.icon?.url,
      skill: char?.core_skill,
   };

   // Some general CSS stuff
   const core_enh_list = [
      {
         name: "A",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyA.png",
      },
      {
         name: "B",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyB.png",
      },
      {
         name: "C",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyC.png",
      },
      {
         name: "D",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyD.png",
      },
      {
         name: "E",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyE.png",
      },
      {
         name: "F",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyF.png",
      },
   ];

   const skill_desc_header = "font-bold text-lg my-1";
   const span_format =
      "<style>div.skill-desc > span { text-shadow: 1px 1px 1px black; }</style>";

   const [skillLevel, setSkillLevel] = useState(6);

   const skill_icon = core.icon;
   const skill_name = core.id;

   const desc_list = core.skill?.levels;
   return (
      <>
         <H2>Core Skill</H2>
         <div dangerouslySetInnerHTML={{ __html: span_format }}></div>

         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 flex my-3 justify-between">
            <div className="flex">
               {skill_icon != "" ? (
                  <>
                     <div className="inline-block mr-2 rounded-full bg-zinc-300 dark:bg-zinc-700 h-fit">
                        <Image
                           height={40}
                           className="object-contain"
                           url={skill_icon}
                           options="height=40"
                           alt={"SkillIcon"}
                        />
                     </div>
                  </>
               ) : null}

               <div className="inline-block mr-2 col-span-11 self-center">
                  {/* Header */}
                  <div className="">
                     <div className="font-bold inline-block mr-2 text-2xl">
                        {skill_name}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Description */}

         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border-t border-r border-l border-color-sub rounded-t-lg px-3 py-1  mt-2 p-1 flex items-center">
            <div className="text-lg mx-2">Lv{skillLevel}</div>
            <input
               aria-label="Level Slider"
               className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
               type="range"
               min="0"
               max={6}
               value={skillLevel}
               onChange={(event) => setSkillLevel(parseInt(event.target.value))}
            ></input>
         </div>
         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border-b border-r border-l border-color-sub rounded-b-lg px-3 py-1 pb-2 flex items-center justify-between gap-x-1">
            {core_enh_list?.map((core, coreind) => {
               return (
                  <>
                     <div
                        className={`w-full justify-center flex invert dark:invert-0 border p-0.5 rounded-md ${
                           skillLevel > coreind
                              ? "border-zinc-200"
                              : "border-zinc-700"
                        }`}
                     >
                        <Image
                           height={30}
                           className={`object-contain ${
                              skillLevel > coreind ? "opacity-70" : "opacity-20"
                           }`}
                           url={core.icon}
                           options="height=30"
                           alt={core.name}
                        />
                     </div>
                  </>
               );
            })}
         </div>
         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 ">
            {desc_list?.[skillLevel]?.descs?.map((desc: any) => {
               var display = desc.desc;
               return (
                  <>
                     <div className={skill_desc_header}>{desc.title}</div>
                     <div
                        className="dark:brightness-100 brightness-7 mb-4 skill-desc"
                        dangerouslySetInnerHTML={{
                           __html: display,
                        }}
                     ></div>
                  </>
               );
            })}

            {/* Stats if applicable */}
            {desc_list?.[skillLevel]?.stats?.length > 0 ? (
               <>
                  <div className={skill_desc_header}>Bonus Stats</div>
                  <div className="grid laptop:grid-cols-2 gap-x-2 gap-y-1 mt-1 mb-3">
                     {desc_list?.[skillLevel]?.stats?.map((stat: any) => {
                        var attr = {
                           label: stat.stat?.name,
                           value: stat.value,
                           icon: stat.stat?.icon?.url,
                        };
                        return (
                           <>
                              <div
                                 className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg
                  bg-zinc-50 dark:bg-dark350 overflow-hidden"
                              >
                                 <StatBlock attr={attr} />
                              </div>
                           </>
                        );
                     })}
                  </div>
               </>
            ) : null}

            {/* Materials if applicable */}
            {desc_list?.[skillLevel]?.materials?.length > 0 ? (
               <>
                  <div className={skill_desc_header}>Materials</div>
                  <Table grid framed dense className="mb-2">
                     <TableHead></TableHead>
                     <TableBody>
                        <TableRow>
                           <TableCell
                              center
                              className="bg-zinc-50 dark:bg-dark350 !pt-1 pb-0"
                           >
                              {desc_list?.[skillLevel]?.materials?.map(
                                 (mat, key) => (
                                    <ItemQtyFrame mat={mat} key={key} />
                                 ),
                              )}
                           </TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </>
            ) : null}
         </div>
      </>
   );
}

const StatSection = ({ statDisplay }: any) => {
   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-x-2 gap-y-1 mt-1 mb-3">
            {/* First row of extra attributes */}

            {statDisplay?.map((attr: any) => (
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg
                  bg-zinc-50 dark:bg-dark350 overflow-hidden"
               >
                  <StatBlock attr={attr} />
               </div>
            ))}
         </div>
      </>
   );
};

const StatBlock = ({ attr }: any) => {
   const attr_icon = attr?.icon;
   const attr_name = attr?.label;
   const attr_val = attr?.value;

   return (
      <>
         <div className="py-1 px-3 justify-between flex items-center gap-2 h-full">
            <div className="flex items-center gap-2">
               {attr_icon ? (
                  <>
                     <div className="items-center inline-block align-middle justify-center h-full mr-1 invert-[0.3]">
                        <Image
                           height={30}
                           className="object-contain"
                           url={attr_icon}
                           options="height=30"
                           alt={attr_name ?? "Icon"}
                        />
                     </div>
                  </>
               ) : null}
               <span className="font-semibold text-sm inline-block align-middle">
                  {attr_name}
               </span>
            </div>
            <div className="text-sm font-semibold">
               <span className="inline-block align-middle">{attr_val}</span>
            </div>
         </div>
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
               className={`relative flex justify-center p-0.5 h-12 w-12 align-middle text-xs bg-zinc-700 text-white text-xs leading-none rounded-md zzz-rarity-${mat.material?.rarity?.id}`}
            >
               <Image
                  height={44}
                  className="object-contain"
                  url={mat.material?.icon?.url ?? "no_image_42df124128"}
                  options="height=44"
                  alt={mat.material?.name}
               />
            </div>

            <div
               className={`relative w-12 align-middle text-xs text-white rounded-b-md `}
            >
               {display_qty}
            </div>
         </a>
      </div>
   );
};
