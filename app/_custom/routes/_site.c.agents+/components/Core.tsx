import { useState } from "react";

import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Core({ data: char }: { data: AgentType }) {
   const core = {
      id: char?.core_skill?.skill_type?.name,
      icon: char?.core_skill?.skill_type?.icon?.url,
      skill: char?.core_skill,
   };

   // Some general CSS stuff
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

         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 flex items-center">
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
         </div>
      </>
   );
}
