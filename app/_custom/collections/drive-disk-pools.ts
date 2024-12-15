import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const DriveDiskPools: CollectionConfig = {
   slug: "drive-disk-pools",
   labels: { singular: "Drive DiskPool", plural: "Drive DiskPools" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
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
         name: "stats",
         type: "array",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "stats",
            },
            {
               name: "value",
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
