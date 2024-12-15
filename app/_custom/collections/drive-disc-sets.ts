import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import {
   afterChangeSearchSyncHook,
   afterDeleteSearchSyncHook,
} from "../hooks/search-hooks";

export const DriveDiscSets: CollectionConfig = {
   slug: "drive-disc-sets",
   labels: { singular: "Drive Disc Set", plural: "Drive Disc Sets" },
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
         type: "textarea",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity_possible",
         type: "relationship",
         relationTo: "rarities",
         hasMany: true,
      },
      {
         name: "set_effect",
         type: "array",
         fields: [
            {
               name: "num",
               type: "number",
            },
            {
               name: "desc",
               type: "textarea",
            },
         ],
      },
      {
         name: "partitions",
         type: "array",
         fields: [
            {
               name: "name",
               type: "text",
            },
            {
               name: "desc",
               type: "textarea",
            },
            {
               name: "partition",
               type: "relationship",
               relationTo: "drive-disc-partitions",
            },
            {
               name: "main_stat_pool",
               type: "relationship",
               relationTo: "drive-disc-pools",
               hasMany: true,
            },
            {
               name: "sub_stat_pool",
               type: "relationship",
               relationTo: "drive-disc-pools",
               hasMany: true,
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
