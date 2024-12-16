import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Skills: CollectionConfig = {
   slug: "skills",
   labels: { singular: "Skill", plural: "Skills" },
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
               type: "number",
            },
            {
               name: "decibel_gain",
               type: "number",
            },
            {
               name: "anomaly_buildup",
               type: "number",
            },
            {
               name: "sp_consume",
               type: "number",
            },
            {
               name: "attack_data",
               type: "number",
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
