import type { Agent as AgentType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { useState } from "react";
import { H2 } from "~/components/Headers";

export function Talents({ data: char }: { data: AgentType }) {
   const talents = char.skills
      ?.filter((a) => a.relationTo == "bangboo_talents")
      ?.map((b) => b.value);

   const [talentLevel, setTalentLevel] = useState(0);

   // Some general CSS stuff
   const span_format =
      "<style>div.skill-desc > span { text-shadow: 1px 1px 1px black; }</style>";

   return (
      <>
         <H2>Talents</H2>
         <div dangerouslySetInnerHTML={{ __html: span_format }}></div>
         {/* Slider */}
         {talents?.length > 0 ? (
            <>
               <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 flex items-center">
                  <div className="text-lg mx-2">Lv{talentLevel + 1}</div>
                  <input
                     aria-label="Level Slider"
                     className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                     type="range"
                     min="0"
                     max={4}
                     value={talentLevel}
                     onChange={(event) =>
                        setTalentLevel(parseInt(event.target.value))
                     }
                  ></input>
               </div>
            </>
         ) : null}

         {talents?.map((tl: any) => {
            const talent_icon = tl.icon?.url;
            const talent_name = tl.name;

            const talent_desc = tl.levels[talentLevel]?.desc;
            return (
               <>
                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 flex my-3 justify-between">
                     <div className="flex">
                        {talent_icon != "" ? (
                           <>
                              <div className="inline-block mr-2 rounded-full bg-zinc-300 dark:bg-zinc-700 h-fit">
                                 <Image
                                    height={40}
                                    className="object-contain"
                                    url={talent_icon}
                                    options="height=40"
                                    alt={"Icon"}
                                 />
                              </div>
                           </>
                        ) : null}

                        <div className="inline-block mr-2 col-span-11 self-center">
                           {/* Header */}
                           <div className="">
                              <div className="font-bold inline-block mr-2 text-2xl">
                                 {talent_name}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Description */}

                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2  mt-2">
                     <div
                        className="dark:brightness-100 brightness-75 skill-desc"
                        dangerouslySetInnerHTML={{ __html: talent_desc }}
                     ></div>
                  </div>
               </>
            );
         })}
      </>
   );
}

{
   /* Slider */
}

{
   /* <input
                    aria-label="Level Slider"
                    className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                    type="range"
                    min="0"
                    max={s?.levels?.length - 1}
                    value={skillLevel}
                    onChange={(event) =>
                      setSkillLevel(parseInt(event.target.value))
                    }
                  ></input> */
}
