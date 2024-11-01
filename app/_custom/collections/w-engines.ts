import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import {
   afterDeleteSearchSyncHook,
   afterChangeSearchSyncHook,
} from "../hooks/search-hooks";

export const WEngines: CollectionConfig = {
   slug: "w-engines",
   labels: { singular: "W-Engine", plural: "W-Engines" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   hooks: {
      afterDelete: [afterDeleteSearchSyncHook],
      afterChange: [afterChangeSearchSyncHook],
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "comment",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_big",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "specialty",
         type: "relationship",
         relationTo: "specialties",
      },
      {
         name: "stat_primary",
         type: "group",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "stats",
            },
            {
               name: "value",
               type: "text",
            },
         ],
      },
      {
         name: "stat_secondary",
         type: "group",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "stats",
            },
            {
               name: "value",
               type: "text",
            },
         ],
      },
      {
         name: "talent_title",
         type: "text",
      },
      {
         name: "talent",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "desc",
               type: "textarea",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
