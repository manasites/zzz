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

export function Skills({ data: char }: { data: AgentType }) {
   const desc_icons = [
      {
         id: "Icon_Normal",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyNormal.png",
      },
      {
         id: "Icon_Special",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeySpecial.png",
      },
      {
         id: "Icon_Evade",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyEvade.png",
      },
      {
         id: "Icon_Ultimate",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyUltimate.png",
      },
      {
         id: "Icon_Switch",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeySwitch.png",
      },
      {
         id: "Icon_JoyStick",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyJoyStick.png",
      },
      {
         id: "Icon_SpecialReady",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeySpecialV2.png",
      },
      {
         id: "Icon_UltimateReady",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyUltimateV2.png",
      },
   ];

   const skills = char?.skills?.map((sk: any) => {
      return {
         id: sk?.skill_type?.name,
         icon: sk?.skill_type?.icon?.url,
         skill: sk,
      };
   });

   // Some general CSS stuff
   const skill_desc_header = "font-bold text-base my-1";
   const toggle_desc_button =
      "text-gray-900 hover:text-white border-2 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-sm font-bold px-3 py-1 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 cursor-pointer";
   const toggle_stats_button =
      "text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm font-bold px-3 py-1 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 cursor-pointer";
   const span_format =
      "<style>div.skill-desc > span { text-shadow: 1px 1px 1px black; }</style>";

   return (
      <>
         <H2>Skills</H2>
         <div dangerouslySetInnerHTML={{ __html: span_format }}></div>
         {skills?.map((sk: any) => {
            const [skillLevel, setSkillLevel] = useState(11);
            const [tab, setTab] = useState(false); // false = Description, true = Stats

            const skill_icon = sk.icon;
            const skill_name = sk.id;

            const desc_list = sk.skill?.description;
            const stat_list = sk.skill?.modifiers;
            const mat_list = sk.skill?.materials;
            return (
               <>
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

                     {/* Toggle for Desc/Stat! */}
                     <div
                        className={`self-center ${
                           tab ? toggle_desc_button : toggle_stats_button
                        }`}
                        onClick={() => setTab(!tab)}
                     >
                        {tab ? "Description" : "Stats"}
                     </div>
                  </div>

                  {/* Stats */}
                  {tab ? (
                     <>
                        <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 flex items-center">
                           <div className="text-lg mx-2">
                              Lv{skillLevel + 1}
                           </div>
                           <input
                              aria-label="Level Slider"
                              className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                              type="range"
                              min="0"
                              max={15}
                              value={skillLevel}
                              onChange={(event) =>
                                 setSkillLevel(parseInt(event.target.value))
                              }
                           ></input>
                        </div>
                        <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1">
                           {/* Stat List */}
                           {stat_list?.map((stat: any, i: any) => {
                              // skillLevel should start at 0
                              return (
                                 <>
                                    {stat.params?.length !== undefined ? (
                                       // Has parameters!
                                       <>
                                          <div className="bg-zinc-200 dark:bg-dark450 rounded-full w-full px-3 py-1 flex justify-between my-1 text-sm">
                                             <div>{stat.title}</div>
                                             <div>
                                                {stat.params[skillLevel]}
                                             </div>
                                          </div>
                                       </>
                                    ) : (
                                       // No parameters
                                       <>
                                          {/* Spacer for additional headers */}
                                          {i > 1 ? (
                                             <div className="w-full mt-3"></div>
                                          ) : null}
                                          <div className={skill_desc_header}>
                                             {stat.title}
                                          </div>
                                       </>
                                    )}
                                 </>
                              );
                           })}
                           {/* Materials */}
                           {mat_list?.[skillLevel]?.materials?.length > 0 ? (
                              <Table grid framed dense>
                                 <TableHead>
                                    <TableRow className="text-sm">
                                       <TableHeader center>
                                          Materials
                                       </TableHeader>
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {/* @ts-ignore */}

                                    <TableRow>
                                       <TableCell center>
                                          {mat_list?.[
                                             skillLevel
                                          ]?.materials?.map((mat, key) => (
                                             <ItemQtyFrame
                                                mat={mat}
                                                key={key}
                                             />
                                          ))}
                                       </TableCell>
                                    </TableRow>
                                 </TableBody>
                              </Table>
                           ) : null}
                        </div>
                     </>
                  ) : (
                     <>
                        {/* Description */}

                        <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 ">
                           {desc_list?.map((desc: any) => {
                              var display = desc.desc;

                              // Description parsing: Replace instances of <IconMap:Icon_Special> etc. with correct icon image
                              const icon_ids = display
                                 .split("<IconMap:")
                                 .slice(1)
                                 .map((a) => a.replace(/\>(.|\n)*/g, ""));
                              for (var i in icon_ids) {
                                 const curr = icon_ids[i];
                                 const ricon = desc_icons.find(
                                    (a) => a.id == curr,
                                 )?.icon;
                                 const regex = "<IconMap:" + curr + ">";

                                 const replace_text = `<img style="display:inline-block; vertical-align:middle; height:25px; width:auto;" src="${ricon}">`;
                                 display = display.replace(regex, replace_text);
                              }

                              return (
                                 <>
                                    <div className={skill_desc_header}>
                                       {desc.name}
                                    </div>
                                    <div
                                       className="dark:brightness-100 brightness-7 mb-4 skill-desc"
                                       dangerouslySetInnerHTML={{
                                          __html: display,
                                       }}
                                    ></div>
                                 </>
                              );
                           })}
                        </div>
                     </>
                  )}
               </>
            );
         })}
      </>
   );
}

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
