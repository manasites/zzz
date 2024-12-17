import type { DriveDiscSet as DriveDiscSetType } from "payload/generated-custom-types";
import { Disclosure } from "@headlessui/react";
import { H2, H3 } from "~/components/Headers";
import { Input } from "~/components/Input";
import { Image } from "~/components/Image";
import { useState } from "react";
import { formatValue } from "~/_custom/utils/valueFormat";

export function Stats({ data }: any) {
   const char = data.DriveDiscSet;
   const json = data.DataJson.json;
   const rarities = char.rarity_possible;

   const [selectedRarity, setSelectedRarity] = useState(
      rarities?.length ? rarities.length - 1 : 0,
   ); // Default to highest rarity
   const [showRarity, setShowRarity] = useState(false);
   const [level, setLevel] = useState(0);
   const [partition, setPartition] = useState(0);

   const json_rarity = json.filter(
      (a) => a.rarity == rarities[selectedRarity]?.id,
   );

   const mainStatDisplay = char?.partitions?.[partition]?.main_stat_pool?.[
      selectedRarity
   ]?.stats?.map((stat) => {
      const basevalue =
         (1 + json_rarity?.find((a) => a.level == level)?.scale / 10000) *
         stat.value;
      const svalue =
         stat.stat?.fmt == "{0:0.#%}" ? basevalue / 10000 : basevalue;

      return {
         label: stat.stat?.name,
         value: formatValue(stat.stat, svalue),
         icon: stat.stat?.icon?.url,
      };
   });

   const subStatDisplay = char?.partitions?.[partition]?.sub_stat_pool?.[
      selectedRarity
   ]?.stats?.map((stat) => {
      const basevalue = stat.value;
      const svalue =
         stat.stat?.fmt == "{0:0.#%}" ? basevalue / 10000 : basevalue;

      return {
         label: stat.stat?.name,
         value: formatValue(stat.stat, svalue),
         icon: stat.stat?.icon?.url,
      };
   });

   return (
      <>
         <H2>Stats</H2>

         {/* Rarity and Level Selector */}
         <div className="grid grid-cols-4 gap-x-1 relative">
            {/* Rarity Selector */}
            <div
               className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2 my-2 items-center flex justify-center cursor-pointer"
               onClick={(event) => setShowRarity(true)}
            >
               <Image
                  width={30}
                  className="object-contain inline-block mx-1"
                  url={rarities[selectedRarity]?.icon_item?.url}
                  options="width=30"
                  alt={rarities[selectedRarity]?.id ?? "Icon"}
               />
               ▼
            </div>
            {showRarity ? (
               <div className="absolute left-0 top-[70px] border border-color-sub bg-zinc-50 dark:bg-zinc-800 p-1">
                  {rarities?.map((rar, rindex) => {
                     return (
                        <div
                           className={`items-center inline-block align-middle rounded-md justify-center mx-1 border border-color-sub rounded-lg px-2 py-1 cursor-pointer ${
                              rindex == selectedRarity
                                 ? "bg-zinc-300 dark:bg-zinc-900"
                                 : "bg-zinc-50 dark:bg-zinc-700"
                           }`}
                           onClick={(event) => {
                              setSelectedRarity(rindex);
                              setShowRarity(false);
                              setLevel(
                                 json.filter(
                                    (a) => a.rarity == rarities[rindex]?.id,
                                 )?.length - 1,
                              );
                           }}
                        >
                           <Image
                              width={30}
                              className="object-contain"
                              url={rar?.icon_item?.url}
                              options="width=30"
                              alt={rar?.id ?? "Icon"}
                           />
                        </div>
                     );
                  })}
               </div>
            ) : null}

            {/* Level Slider */}
            <div className="col-span-3 bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2 my-2 text-center">
               <div className="flex w-full items-center justify-between text-center gap-3">
                  {/* Level Label */}
                  <div className="inline-flex justify-between align-middle">
                     Lvl
                  </div>
                  {/* Level Input Box */}
                  <Input
                     className="!w-16 flex-none"
                     type="number"
                     aria-label="Level"
                     value={level}
                     onChange={(event) => {
                        const numonly = /^[0-9\b]+$/;
                        const maxval = json_rarity.length - 1;

                        // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                        if (numonly.test(event.target.value)) {
                           let input = parseInt(event.target.value);
                           if (input > maxval) {
                              input = maxval;
                           } else if (input < 1) {
                              input = 1;
                           }
                           setLevel(input);
                        }
                     }}
                  />
                  {/* Slider */}
                  <input
                     aria-label="Level Slider"
                     className="flex-grow w-full"
                     type="range"
                     min="0"
                     max={json_rarity.length - 1}
                     value={level}
                     onChange={(event) =>
                        setLevel(parseInt(event.target.value))
                     }
                  ></input>
               </div>
            </div>
         </div>
         {/* Partition Selector */}
         <div className="flex justify-between items-center gap-x-1">
            {[0, 1, 2, 3, 4, 5].map((p) => (
               <div
                  className={`border border-color-sub shadow-sm shadow-l rounded-lg text-2xl w-full text-center cursor-pointer ${
                     partition == p
                        ? "bg-zinc-200 dark:bg-zinc-800"
                        : "bg-zinc-50 dark:bg-dark350"
                  }`}
                  onClick={(event) => setPartition(p)}
               >
                  {p + 1}
               </div>
            ))}
         </div>

         {/* Main Stats */}
         <div className="my-1 font-bold text-lg">Main Stats Possible</div>
         <StatSection statDisplay={mainStatDisplay} />

         {/* Sub Stats */}
         <div className="my-1 font-bold text-lg">Sub Stats Possible</div>
         <StatSection statDisplay={subStatDisplay} />
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
