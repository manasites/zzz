import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _DamageTypes: CollectionConfig = {
  slug: "_damage-types",
  labels: { singular: "_damage-type", plural: "_damage-types" },
  admin: {
    group: "Custom",
    useAsTitle: "name",
  },
  access: {
    create: isStaff, //udpate in future to allow site admins as well
    read: () => true,
    update: isStaff, //udpate in future to allow site admins as well
    delete: isStaff, //udpate in future to allow site admins as well
  },
  fields: [
    {
      name: "id",
      type: "text",
    },
    {
      name: "data_key",
      type: "text",
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "icon_id",
      type: "text",
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "checksum",
      type: "text",
    },
  ],
};
