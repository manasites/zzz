import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import {
   afterChangeSearchSyncHook,
   afterDeleteSearchSyncHook,
} from "../hooks/search-hooks";

export const Agents: CollectionConfig = {
   slug: "agents",
   labels: { singular: "Agent", plural: "Agents" },
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
         name: "name_code",
         type: "text",
      },
      {
         name: "name_full",
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
         name: "icon_general",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_round",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "character_specialty",
         type: "relationship",
         relationTo: "specialties",
      },
      {
         name: "damage_element",
         type: "relationship",
         relationTo: "damage-elements",
         hasMany: true,
      },
      {
         name: "damage_type",
         type: "relationship",
         relationTo: "damage-types",
         hasMany: true,
      },
      {
         name: "character_camp",
         type: "relationship",
         relationTo: "character-camps",
      },
      {
         name: "gender",
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
               name: "base",
               type: "number",
            },
            {
               name: "growth",
               type: "number",
            },
         ],
      },
      {
         name: "skills",
         type: "relationship",
         relationTo: "skills",
         hasMany: true,
      },
      {
         name: "core_skill",
         type: "relationship",
         relationTo: "agent-core-skills",
      },
      {
         name: "talents",
         type: "relationship",
         relationTo: "talents",
         hasMany: true,
      },
      {
         name: "ascension_data",
         type: "array",
         fields: [
            {
               name: "asc",
               type: "number",
            },
            {
               name: "lv_min",
               type: "number",
            },
            {
               name: "lv_max",
               type: "number",
            },
            {
               name: "stat_adv",
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
               name: "stat_add",
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
         name: "mindscape_art_1",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "mindscape_art_2",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "mindscape_art_3",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "profile_info",
         type: "text",
      },
      {
         name: "profile_desc",
         type: "text",
      },
      {
         name: "height",
         type: "text",
      },
      {
         name: "bday",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
