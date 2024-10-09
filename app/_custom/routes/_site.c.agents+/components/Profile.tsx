import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

export function Profile({ data: char }: { data: AgentType }) {
   const tableDisplay = [
      {
         label: "Birthday",
         value: char?.bday,
      },
      {
         label: "Height",
         value: char?.height,
      },
   ];
   const textDisplay = [
      {
         label: "Info",
         value: char?.profile_info,
      },
      {
         label: "Description",
         value: char?.profile_desc,
      },
   ];

   return (
      <>
         <H2>Profile</H2>
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
         >
            {tableDisplay?.map((row) => (
               <div className="px-4 py-2 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold">{row.label}</span>
                  </div>
                  <div className="font-semibold">
                     <span className="inline-block align-middle">
                        {row.value}
                     </span>
                  </div>
               </div>
            ))}
            {textDisplay?.map((row) => (
               <div
                  className="px-4 py-3 justify-between flex items-center gap-2 text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: row.value }}
               ></div>
            ))}
         </div>
      </>
   );
}
