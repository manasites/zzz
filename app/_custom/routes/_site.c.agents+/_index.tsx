import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";

import { Icon } from "~/components/Icon";
import type { Agent } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { List } from "~/routes/_site+/c_+/_components/List";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const list = await fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: CHARACTERS,
      },
   });

   return json({ list });
}

export default function CharactersList() {
   const { list } = useLoaderData<typeof loader>();
   const chars = list?.listData?.docs;

   const elementries = chars.map((c: any) => c.damage_element).flat();
   const typeentries = chars.map((c: any) => c.character_specialty).flat();
   console.log(elementries);
   const filters = [
      {
         id: "rarity",
         label: "Rarity",
         cols: 2 as const,
         options: [
            {
               value: "3",
               label: "A",
               icon: "https://static.mana.wiki/zzz/Rarity_3.png",
            },
            {
               value: "4",
               label: "S",
               icon: "https://static.mana.wiki/zzz/Rarity_4.png",
            },
         ],
      },
      {
         id: "damage_element",
         label: "Element",
         cols: 3 as const,
         options: [
            {
               value: "2000",
               label: "Physical",
               icon:
                  elementries.find((c: any) => c.id == "2000")?.icon?.url ?? "",
            },
            {
               value: "2010",
               label: "Fire",
               icon: elementries.find((c: any) => c.id == "2010")?.icon?.url,
            },
            {
               value: "2020",
               label: "Ice",
               icon: elementries.find((c: any) => c.id == "2020")?.icon?.url,
            },
            {
               value: "2021",
               label: "Frost",
               icon: elementries.find((c: any) => c.id == "2021")?.icon?.url,
            },
            {
               value: "2030",
               label: "Electric",
               icon: elementries.find((c: any) => c.id == "2030")?.icon?.url,
            },
            {
               value: "2050",
               label: "Ether",
               icon: elementries.find((c: any) => c.id == "2050")?.icon?.url,
            },
         ],
      },
      {
         id: "character_specialty",
         label: "Specialty",
         cols: 3 as const,
         options: [
            {
               value: "1",
               label: "Attack",
               icon: typeentries.find((c: any) => c.id == "1")?.icon?.url,
            },
            {
               value: "2",
               label: "Stun",
               icon: typeentries.find((c: any) => c.id == "2")?.icon?.url,
            },
            {
               value: "3",
               label: "Anomaly",
               icon: typeentries.find((c: any) => c.id == "3")?.icon?.url,
            },
            {
               value: "4",
               label: "Support",
               icon: typeentries.find((c: any) => c.id == "4")?.icon?.url,
            },
            {
               value: "5",
               label: "Defense",
               icon: typeentries.find((c: any) => c.id == "5")?.icon?.url,
            },
         ],
      },
      {
         id: "character_camp",
         label: "Faction",
         cols: 1 as const,
         options: [
            {
               value: "1",
               label: "Cunning Hares",
               icon: chars.find((c: any) => c.character_camp?.id == "1")
                  ?.character_camp.icon?.url,
            },
            {
               value: "2",
               label: "Victoria Housekeeping Co.",
               icon: chars.find((c: any) => c.character_camp?.id == "2")
                  ?.character_camp.icon?.url,
            },
            {
               value: "3",
               label: "Belobog Heavy Ind.",
               icon: chars.find((c: any) => c.character_camp?.id == "3")
                  ?.character_camp.icon?.url,
            },
            {
               value: "4",
               label: "Sons of Calydon",
               icon: chars.find((c: any) => c.character_camp?.id == "4")
                  ?.character_camp.icon?.url,
            },
            {
               value: "5",
               label: "Obol Squad",
               icon: chars.find((c: any) => c.character_camp?.id == "5")
                  ?.character_camp.icon?.url,
            },
            {
               value: "6",
               label: "Hollow Spec. Ops. S6",
               icon: chars.find((c: any) => c.character_camp?.id == "6")
                  ?.character_camp.icon?.url,
            },
            {
               value: "7",
               label: "Criminal Investigation Special Response Team",
               icon: chars.find((c: any) => c.character_camp?.id == "7")
                  ?.character_camp.icon?.url,
            },
         ],
      },
   ];

   return (
      <List
         gridView={gridView}
         columns={columns}
         defaultViewType={"grid"}
         columnViewability={{
            id: false,
         }}
         filters={filters}
      />
   );
}

const columnHelper = createColumnHelper<Agent>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => {
      const elemurl = info.row.original?.damage_element[0]?.icon?.url;
      const typesmall = info.row.original?.character_specialty?.icon?.url;
      const campurl = info.row.original?.character_camp?.icon?.url;
      const raritynum = info.row.original?.rarity?.name;
      var rarityhex;
      switch (raritynum) {
         case "A":
            rarityhex = "#d06bff";
            break;
         case "S":
            rarityhex = "#ffa114";
            break;
         default:
      }
      const rarityurl = info.row.original?.rarity?.icon?.url;
      const cid = info.row.original.slug ?? info.row.original?.id;
      const iconurl =
         info.row.original.icon_round?.id == "IconRoleCircle01" &&
         info.row.original?.id != "1011"
            ? "https://static.mana.wiki/zzz/IconRoleCircle_Generic_Unknown.png"
            : info.row.original.icon_round?.url;

      return (
         <Link
            key={cid}
            prefetch="intent"
            to={`/c/agents/${cid}`}
            className="flex items-center justify-center rounded-md p-2"
         >
            {/* Character Icon */}
            <div className="relative w-full">
               {/* Camp */}
               <div
                  className="border-color shadow-1 absolute left-1 bottom-5 z-20 flex
         h-7 w-7 items-center justify-center rounded-full border bg-zinc-800 shadow"
               >
                  <Image
                     options="aspect_ratio=1:1&height=42&width=42"
                     alt="Name"
                     url={campurl}
                     className="object-contain"
                  />
                  {/* layout="fill" objectFit="contain" /> */}
               </div>

               {/* Type */}
               <div className="border-color shadow-1 absolute left-1 -top-2 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                  <Image
                     options="aspect_ratio=1:1&height=42&width=42"
                     alt="Path"
                     className="object-contain"
                     url={typesmall}
                     loading={"lazy"}
                  />
               </div>

               {/* Element */}
               <div className="border-color shadow-1 absolute right-1 -top-2 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                  <Image
                     options="aspect_ratio=1:1&height=42&width=42"
                     alt="Path"
                     className="object-contain"
                     url={elemurl}
                     loading={"lazy"}
                  />
               </div>

               {/* Rarity */}
               <div className="border-color shadow-1 absolute right-1 bottom-5 z-20 h-7 w-7 rounded-full border bg-zinc-800 shadow">
                  <Image
                     options="aspect_ratio=1:1&height=42&width=42"
                     alt="Path"
                     className="object-contain"
                     url={rarityurl}
                     loading={"lazy"}
                  />
               </div>

               <div className="relative flex w-full items-center justify-center">
                  <div className="border-color shadow-1 overflow-hidden rounded-full border-2 shadow-sm">
                     <Image
                        width={96}
                        height={96}
                        options="aspect_ratio=1:1&height=96&width=96"
                        url={iconurl}
                        alt={info.row.original?.name}
                     />
                  </div>
               </div>
               {/* Character Name, Color border by rarity */}
               <div
                  style={{ "border-color": `${rarityhex}` }}
                  className={`p-1 text-center text-xs font-bold border-b-4`}
               >
                  {info.row.original?.name}
               </div>
            </div>
         </Link>
      );
   },
});

const columns = [
   columnHelper.accessor("id", {
      header: "Id",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("name", {
      header: "Agent",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/agents/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               <Image
                  width={38}
                  url={
                     info.row.original.icon_round?.id == "IconRoleCircle01" &&
                     info.row.original?.id != "1011"
                        ? "https://static.mana.wiki/zzz/IconRoleCircle_Generic_Unknown.png"
                        : info.row.original.icon_round?.url
                  }
                  options="width=80"
               />
               <div>{info.row.original.name}</div>
            </Link>
         );
      },
   }),
   columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.rarity?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               {/* <span>{info.getValue()?.name}</span> */}
               <Image
                  width={25}
                  height={25}
                  options="height=80&width=80"
                  url={info.row.original?.rarity?.icon?.url}
                  alt={info.row.original?.rarity?.name}
               />
            </div>
         );
      },
   }),
   columnHelper.accessor("damage_element", {
      header: "Element",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.damage_element[0]?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <Image
                  width={25}
                  height={25}
                  options="height=80&width=80"
                  url={info.row.original?.damage_element[0]?.icon?.url}
                  alt={info.row.original?.damage_element[0]?.name}
               />
            </div>
         );
      },
   }),
   columnHelper.accessor("character_specialty", {
      header: "Specialty",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.character_specialty?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <Image
                  width={25}
                  height={25}
                  options="height=80&width=80"
                  url={info.row.original?.character_specialty?.icon?.url}
                  alt={info.row.original?.character_specialty?.name}
               />
            </div>
         );
      },
   }),
   columnHelper.accessor("character_camp", {
      header: "Faction",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.character_camp?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <Image
                  width={25}
                  height={25}
                  options="height=80&width=80"
                  url={info.row.original?.character_camp?.icon?.url}
                  alt={info.row.original?.character_camp?.name}
               />
            </div>
         );
      },
   }),
];

const CHARACTERS = gql`
   query {
      listData: Agents(
         limit: 100
         sort: "name"
         where: { name: { not_equals: null } }
      ) {
         docs {
            id
            name
            name_code
            slug
            icon_round {
               id
               url
            }
            rarity {
               id
               name
               icon {
                  url
               }
            }
            damage_type {
               id
               name
               icon {
                  url
               }
            }
            damage_element {
               id
               name
               icon {
                  url
               }
            }
            character_specialty {
               id
               name
               icon {
                  url
               }
            }
            character_camp {
               id
               name
               icon {
                  url
               }
            }
         }
      }
   }
`;
