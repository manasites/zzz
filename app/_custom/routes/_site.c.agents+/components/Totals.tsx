import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import clsx from "clsx";

import { H2 } from "~/components/Headers";
import { Icon } from "~/components/Icon";

export function Totals({ data: char }: { data: any }) {
   //@ts-ignore

   return (
      <>
         <div
            dangerouslySetInnerHTML={{
               __html: `<style>
                    div.zzz-rarity-1 {
                        border-bottom: 4px solid #7DA89B;
                    }
                    div.zzz-rarity-2 {
                        border-bottom: 4px solid #7DA89B;
                    }
                    div.zzz-rarity-3 {
                        border-bottom: 4px solid #00A9FF;
                    }
                    div.zzz-rarity-4 {
                        border-bottom: 4px solid #E900FF;
                    }
                    div.zzz-rarity-5 {
                        border-bottom: 4px solid #FFBA05;
                    }
                  </style>`,
            }}
         ></div>

         <H2>Total Materials</H2>
         <TotalMaterials data={char} />
      </>
   );
}

const TotalMaterials = ({ data }: any) => {
   const ascData = data?.ascension_data;
   let ascTotal = CalculateTotals(ascData);

   const skillData = data?.skills?.map((skill) => skill?.materials)?.flat();
   let skillTotal = CalculateTotals(skillData);

   const total_display = [
      {
         name: "Full Ascension",
         data: ascTotal,
      },
      {
         name: "All Skills",
         data: skillTotal,
      },
   ];

   return (
      <>
         <Table grid framed dense>
            <TableHead></TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {total_display?.map((row, index) => {
                  return (
                     <>
                        <TableRow key={"total_material_table_" + index}>
                           <TableHeader center className="text-sm !py-1">
                              {row.name}
                           </TableHeader>
                           <TableCell center className="!py-1">
                              {/* @ts-ignore */}
                              {row.data?.map((mat, key) => (
                                 <ItemQtyFrame mat={mat} key={key} />
                              ))}
                           </TableCell>
                        </TableRow>
                     </>
                  );
               })}
            </TableBody>
         </Table>
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
