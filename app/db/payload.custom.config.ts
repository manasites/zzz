import { buildConfig } from "payload/config";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import dotenv from "dotenv";
import path from "path";
import { Images } from "./collections/Images";
import { BackMana } from "./components/BackMana";
import { Logo } from "./components/Logo";
import { Users } from "./collections/CustomUsers";
import { CustomCollections } from "../_custom/collections";

dotenv.config();

const bucketName = process.env.PAYLOAD_PUBLIC_BUCKET ?? "";

const adapter = s3Adapter({
   config: {
      endpoint: "https://s3.us-west-004.backblazeb2.com",
      credentials: {
         accessKeyId: process.env.PAYLOAD_PUBLIC_BACKBLAZE_KEYID || "",
         secretAccessKey:
            process.env.PAYLOAD_PUBLIC_BACKBLAZE_APPLICATION_KEY || "",
      },
      region: "us-west-004",
   },
   bucket: bucketName,
});

export default buildConfig({
   admin: {
      components: {
         beforeNavLinks: [BackMana],
         graphics: {
            Icon: Logo,
            Logo: Logo,
         },
      },
      css: path.resolve(__dirname, "./db.css"),
      user: "users",
      meta: {
         favicon: "/favicon.ico",
         ogImage: "/og-image.png",
         titleSuffix: "Mana",
      },
   },
   plugins: [
      cloudStorage({
         collections: {
            images: {
               adapter,
               generateFileURL: (file) => {
                  const { filename } = file;
                  return `https://static.mana.wiki/file/${bucketName}/${process.env.PAYLOAD_PUBLIC_SITE_ID}/${filename}`;
               },
               prefix: process.env.PAYLOAD_PUBLIC_SITE_ID,
            },
         },
      }),
      //@ts-ignore
      ...(process.env.NODE_ENV == "production" ? [cachePlugin({})] : []),
   ],
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
   collections: [Users, Images, ...CustomCollections],
});
