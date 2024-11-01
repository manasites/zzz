import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const DamageElements: CollectionConfig = {
   slug: "damage-elements",
   labels: { singular: "Damage Element", plural: " Damage Elements" },
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
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
