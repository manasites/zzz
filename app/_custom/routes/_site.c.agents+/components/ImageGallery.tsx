import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function ImageGallery({ data: char }: { data: AgentType }) {
   const gallery_items = [
      {
         name: "Mindscape #1",
         url: char?.mindscape_art_1?.url,
      },
      {
         name: "Mindscape #2",
         url: char?.mindscape_art_2?.url,
      },
      {
         name: "Mindscape #3",
         url: char?.mindscape_art_3?.url,
      },
      {
         name: "Icon",
         url: char?.icon?.url,
      },
      {
         name: "Round Icon",
         url: char?.icon_round?.url,
      },
      {
         name: "Image",
         url: char?.icon_full?.url,
      },
      {
         name: "Select",
         url: char?.icon_general?.url,
      },
   ];

   return (
      <>
         <H2>Image Gallery</H2>
         <div className="mb-3 grid w-full grid-cols-3 gap-3">
            {gallery_items.map((g, i) => {
               return (
                  <>
                     <div
                        className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm"
                        key={i}
                     >
                        <div className="border-color-sub bg-3-sub relative block border-b py-2 text-center text-sm font-bold">
                           {g.name}
                        </div>
                        <a href={g.url}>
                           <div className="bg-2-sub relative flex w-full items-center justify-center p-3">
                              <div className="relative flex h-24 w-24 text-center">
                                 <Image
                                    options="height=120"
                                    alt="Gallery Item"
                                    url={g.url}
                                    className="object-contain"
                                 />
                              </div>
                           </div>
                        </a>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
}
