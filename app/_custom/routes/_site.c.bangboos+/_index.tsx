import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";

import { Icon } from "~/components/Icon";
import type { Bangboo } from "payload/generated-custom-types";
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
         query: BANGBOOS,
      },
   });

   //@ts-ignore
   return json({ list });
}

export default function CharactersList() {
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

type FilterTypes = {
   id: string;
   name: string;
   field: string;
};

type FilterOptionType = {
   name: string;
   id: string;
   icon?: string;
};

const columnHelper = createColumnHelper<Bangboo>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         to={`/c/bangboos/${info.row.original.slug ?? info.row.original.id}`}
      >
         <div className="relative w-full">
            {/* Rarity */}
            <div
               className="border-color shadow-1 absolute left-1 bottom-5 z-20 flex
                     h-7 w-7 items-center justify-center rounded-full border bg-zinc-800 shadow"
            >
               <Image
                  options="aspect_ratio=1:1&height=42&width=42"
                  alt="Name"
                  url={info.row.original.rarity?.icon?.url}
                  className="object-contain"
               />
               {/* layout="fill" objectFit="contain" /> */}
            </div>

            <div className="relative flex w-full items-center justify-center">
               <div className="border-color shadow-1 overflow-hidden rounded-full border-2 shadow-sm">
                  <Image
                     width={96}
                     height={96}
                     options="aspect_ratio=1:1&height=96&width=96"
                     url={info.row.original.icon?.url}
                     alt={info.row.original?.name}
                  />
               </div>
            </div>
            {/* Character Name, Color border by rarity */}
            <div className={`p-1 text-center text-xs font-bold`}>
               {info.row.original.name}
            </div>
         </div>
      </Link>
   ),
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
      header: "Bangboo",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/bangboos/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               <Image
                  width={38}
                  url={info.row.original.icon?.url}
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
];

const BANGBOOS = gql`
   query {
      listData: Bangboos(
         limit: 0
         sort: "id"
         where: { name: { not_equals: "Eous" } }
      ) {
         docs {
            id
            slug
            name
            rarity {
               id
               name
               icon {
                  url
               }
            }
            icon {
               url
            }
            icon_full {
               url
            }
         }
      }
   }
`;

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
];
