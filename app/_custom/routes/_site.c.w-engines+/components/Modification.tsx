import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

import { H2 } from "~/components/Headers";

export function Modification({ data: char }: { data: any }) {
   //@ts-ignore
   const asc_cost = char.modifications;

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

         <H2>Modification Materials</H2>

         <Table grid framed dense>
            <TableHead>
               <TableRow className="text-sm">
                  <TableHeader center>Modification</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {asc_cost?.map((promo, index) => {
                  return (
                     <>
                        {promo.materials?.length > 0 ? (
                           <TableRow key={index}>
                              <TableCell center className="!py-1">
                                 <div>Lv. {(index + 1) * 10}</div>
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
   const cnt = mat?.qty;
   const display_qty = cnt
      ? cnt > 999999
         ? Math.round(cnt / 1000000) + "M"
         : cnt > 999
         ? Math.round(cnt / 1000) + "k"
         : cnt
      : "";

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
