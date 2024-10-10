import type { DiskDriveSet as DiskDriveSetType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { useState } from "react";
import { H2 } from "~/components/Headers";

export function Effects({ data: char }: { data: DiskDriveSetType }) {
   const set_effects = char.set_effect;

   const span_format =
      "<style>div.skill-desc > span { text-shadow: 1px 1px 1px black; }</style>";

   return (
      <>
         <H2>Set Effects</H2>
         <div dangerouslySetInnerHTML={{ __html: span_format }}></div>
         {/* Description */}
         {set_effects?.map((effect: any) => {
            return (
               <>
                  <div className="grid grid-cols-8 bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2 my-2">
                     <div className="col-span-1">{effect.num}-Pc:</div>
                     <div
                        className="col-span-7 skill-desc"
                        dangerouslySetInnerHTML={{ __html: effect.desc }}
                     ></div>
                  </div>
               </>
            );
         })}
      </>
   );
}
