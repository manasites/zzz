import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const AgentCoreSkills: CollectionConfig = {
   slug: "agent-core-skills",
   labels: { singular: "agent-core-skill", plural: "agent-core-skills" },
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
         name: "levels",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "descs",
               type: "array",
               fields: [
                  {
                     name: "title",
                     type: "text",
                  },
                  {
                     name: "desc",
                     type: "textarea",
                  },
               ],
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
               name: "materials",
               type: "array",
               fields: [
                  {
                     name: "material",
                     type: "relationship",
                     relationTo: "materials",
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
