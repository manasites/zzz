import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import {
   afterDeleteSearchSyncHook,
   afterChangeSearchSyncHook,
} from "../hooks/search-hooks";

export const Achievements: CollectionConfig = {
   slug: "achievements",
   labels: { singular: "Achievement", plural: "Achievements" },
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
         name: "name",
         type: "text",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "achievement-rarities",
      },
      {
         name: "subgroup",
         type: "relationship",
         relationTo: "achievement-subgroups",
      },
      {
         name: "rewards",
         type: "array",
         fields: [
            {
               name: "item",
               type: "relationship",
               relationTo: "materials",
            },
            {
               name: "qty",
               type: "number",
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
