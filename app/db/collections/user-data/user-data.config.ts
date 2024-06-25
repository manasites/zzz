import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import {
   canCreateUserData,
   canDeleteUserData,
   canReadUserData,
   canUpdateUserData,
} from "./user-data.access";
import { isStaffFieldLevel } from "../users/users.access";

export const UserData: CollectionConfig = {
   slug: "user-data",
   access: {
      create: canCreateUserData,
      read: canReadUserData,
      update: canUpdateUserData,
      delete: canDeleteUserData,
   },
   fields: [
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         maxDepth: 1,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         required: true,
         maxDepth: 1,
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "data",
         type: "json",
      },
   ],
};
