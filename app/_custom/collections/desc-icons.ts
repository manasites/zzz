import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const DescIcons: CollectionConfig = {
   slug: "desc-icons",
   labels: { singular: "Desc Icon", plural: "Desc Icons" },
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
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "size",
         type: "number",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
