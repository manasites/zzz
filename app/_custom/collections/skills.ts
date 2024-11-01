import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import {
   afterDeleteSearchSyncHook,
   afterChangeSearchSyncHook,
} from "../hooks/search-hooks";

export const Skills: CollectionConfig = {
   slug: "skills",
   labels: { singular: "Skill", plural: "Skills" },
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
         name: "skill_type",
         type: "relationship",
         relationTo: "agent-skill-types",
      },
      {
         name: "description",
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
         ],
      },
      {
         name: "modifiers",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "params",
               type: "json",
            },
            {
               name: "energy_gain",
               type: "text",
            },
            {
               name: "decibel_gain",
               type: "text",
            },
            {
               name: "anomaly_buildup",
               type: "text",
            },
         ],
      },
      {
         name: "materials",
         type: "array",
         fields: [
            {
               name: "lv",
               type: "number",
            },
            {
               name: "materials",
               type: "array",
               fields: [
                  {
                     name: "material",
                     type: "relationship",
                     relationTo: "materials",
                     hasMany: false,
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ],
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
