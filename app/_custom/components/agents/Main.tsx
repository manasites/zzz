import { useState } from "react";
import { Input } from "~/components/Input";

import { Disclosure } from "@headlessui/react";

import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Main({ data: char }: { data: AgentType }) {
  const [level, setLevel] = useState(60);
  const [levelAscensionCheck, setLevelAscensionCheck] = useState(true);

  const mainImage = char?.icon_full?.url;
  const mainName = char?.name;
  const mainStatDisplay = [
    {
      label: "Rarity",
      value: char?.rarity?.name,
      icon: char?.rarity?.icon?.url,
    },
    {
      label: "Type",
      value: char?.damage_type?.[0]?.name,
      icon: char?.damage_type?.[0]?.icon?.url,
    },
    {
      label: "Element",
      value: char?.damage_element?.[0]?.name,
      icon: char?.damage_element?.[0]?.icon?.url,
    },
    {
      label: "Faction",
      value: char?.character_camp?.name,
      icon: char?.character_camp?.icon?.url,
    },
  ];

  // Get the ascension_data array index based on current selected level and ascension checkmark
  const asc_index =
    Math.floor(level / 10) +
    ((!levelAscensionCheck && level / 10 == Math.floor(level / 10)) ||
    level == 60
      ? -1
      : 0);

  const dispasc = char?.ascension_data?.[asc_index]?.asc;

  const statDisplay = [
    {
      label: "HP",
      value: calcStat(
        level,
        char?.hp,
        char?.ascension_data?.[asc_index]?.hp_adv,
        char?.hp_growth
      ),
      icon: "https://static.mana.wiki/zzz/IconHpMax.png",
    },
    {
      label: "DEF",
      value: calcStat(
        level,
        char?.def,
        char?.ascension_data?.[asc_index]?.def_adv,
        char?.def_growth
      ),
      icon: "https://static.mana.wiki/zzz/IconDef.png",
    },
    {
      label: "CRIT Rate",
      value: char?.crit,
      icon: "https://static.mana.wiki/zzz/IconCrit.png",
      percent: true,
    },
    {
      label: "PEN Ratio",
      value: 0,
      icon: "https://static.mana.wiki/zzz/IconPenRatio.png",
      percent: true,
    },

    {
      label: "Energy Regen",
      value: 1.2,
      icon: "https://static.mana.wiki/zzz/IconSpRecover.png",
    },
    {
      label: "ATK",
      value: calcStat(
        level,
        char?.atk,
        char?.ascension_data?.[asc_index]?.atk_adv,
        char?.atk_growth
      ),
      icon: "https://static.mana.wiki/zzz/IconAttack.png",
    },
    {
      label: "Impact",
      value: char?.impact,
      icon: "https://static.mana.wiki/zzz/IconBreakStun.png",
    },
    {
      label: "Crit DMG",
      value: char?.crit_damage,
      icon: "https://static.mana.wiki/zzz/IconCritDam.png",
      percent: true,
    },
    {
      label: "PEN",
      value: 0,
      icon: "https://static.mana.wiki/zzz/IconPenValue.png",
    },
    {
      label: "Attribute Mastery",
      value: char?.attribute_mastery,
      icon: "https://static.mana.wiki/zzz/IconAddedElementAccumulationRatio.png",
    },
  ];

  return (
    <>
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
        <section>
          <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full p-3">
            <Image
              height={320}
              className="object-contain"
              url={mainImage ?? "https://static.mana.wiki/zzz/Run2_00016.png"}
              options="height=320"
              alt={mainName ?? "Icon"}
            />
          </div>
        </section>
        <section>
          <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
          >
            {mainStatDisplay?.map((row) => (
              <div className="px-3 py-1 justify-between flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{row.label}</span>
                </div>
                <div className="text-sm font-semibold">
                  <span className="inline-block align-middle">{row.value}</span>
                  {row.icon ? (
                    <>
                      <div className="items-center inline-block align-middle rounded-md justify-center dark:bg-dark350 bg-zinc-600 h-full ml-2">
                        <Image
                          width={30}
                          className="object-contain"
                          url={row?.icon}
                          options="width=30"
                          alt={mainName ?? "Icon"}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <H2 text="Stats" />
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mt-1 mb-3">
        {/* First row of extra attributes */}
        <section>
          <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
          >
            {statDisplay
              ?.filter((v: any, i: any) => i < 5)
              .map((attr: any) => {
                return <StatBlock attr={attr} />;
              })}
          </div>
        </section>

        {/* Second row of extra attributes */}
        <section>
          <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
          >
            {statDisplay
              ?.filter((v: any, i: any) => i >= 5)
              .map((attr: any) => {
                return <StatBlock attr={attr} />;
              })}
          </div>
        </section>
      </div>

      {/* ======================== */}
      {/* Stats Slider and additional top info block */}
      {/* ======================== */}
      {/* 2a) Header for Adjusting Level and Slider */}
      {/* ======================== */}
      <div className="bg-2-sub shadow-1 border-color-sub my-3 rounded-lg border px-6 py-3 font-bold shadow-sm">
        <div className="flex w-full items-center justify-between text-center">
          <div className="flex items-center gap-3">
            {/* Level Label */}
            <div className="inline-flex justify-between align-middle">Lvl</div>
            {/* Level Input Box */}
            <Input
              className="!w-16 flex-none"
              type="number"
              aria-label="Level"
              value={level}
              onChange={(event) => {
                const numonly = /^[0-9\b]+$/;
                const maxval = 60;

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
            {/* ◇ ◆ ☆ ★ Symbols */}
            <div className="flex text-md font-bold px-1 items-center self-center rounded-full bg-zinc-500 h-6">
              {[2, 3, 4, 5, 6].map((stg: any) => (
                <div
                  className={`inline-block text-sm align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                    dispasc >= stg ? "text-white" : "text-black"
                  }`}
                >
                  ★
                </div>
                // <Image
                //   height={15}
                //   className={`object-contain inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                //     dispasc >= stg ? "invert-[0.10]" : "invert-[0.90]"
                //   }`}
                //   url={"https://static.mana.wiki/endfield/icon_breakmark_01.png"}
                //   options="height=15"
                //   alt={">"}
                // />
              ))}
            </div>
            {/* Asc Label */}
            <div className="inline-flex justify-between align-middle text-sm">
              Asc
            </div>
            {/* Ascension Checkbox */}
            <input
              className="mr-2 inline-flex h-6 w-6 flex-shrink-0 items-center 
                     justify-between rounded-sm align-middle text-zinc-500"
              type="checkbox"
              aria-label="Ascension"
              disabled={
                // [20, 40, 60, 70, 80, 90].indexOf(levelSliderValue) < -1
                ["10", "20", "30", "40", "50"].indexOf(level.toString()) > -1
                  ? false
                  : true
              }
              checked={levelAscensionCheck}
              onChange={(event) => setLevelAscensionCheck(event.target.checked)}
            ></input>
          </div>
          {/* Slider */}
          <input
            aria-label="Level Slider"
            className="flex-grow"
            type="range"
            min="1"
            max="60"
            value={level}
            onChange={(event) => setLevel(parseInt(event.target.value))}
          ></input>
        </div>
      </div>
    </>
  );
}

const StatBlock = ({ attr }: any) => {
  const attr_icon = attr?.icon;
  const attr_name = attr?.label;
  const attr_val = attr?.value;
  const attr_perc = attr?.percent;

  return (
    <>
      <div className="py-1 px-3 justify-between flex items-center gap-2">
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
          <span className="inline-block align-middle">
            {attr_perc ? attr_val / 100 + "%" : attr_val}
          </span>
        </div>
      </div>
    </>
  );
};

function calcStat(
  level: any,
  base: any,
  adv: any,
  growth: any,
  divisor: any = 1
) {
  return Math.floor(base + adv + ((level - 1) * growth) / (10000 / divisor));
}
