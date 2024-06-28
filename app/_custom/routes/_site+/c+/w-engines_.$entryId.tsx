// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { ImageGallery } from "~/_custom/components/w-engines/ImageGallery";
import { Main } from "~/_custom/components/w-engines/Main";
import { Talents } from "~/_custom/components/w-engines/Talents";
import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";
import type { WEngine as WEngineType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { WEngines } from "../../../collections/w-engines";

// Custom Site / Collection Config Imports

// Custom Component Imports
export { entryMeta as meta };

// Loader definition - loads Entry data!
export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const fetchWEngineData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });
   const fetchWLevelData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: WLEVEL_QUERY,
      },
   });

   const [{ entry }, wlevel] = await Promise.all([
      fetchWEngineData,
      fetchWLevelData,
   ]);

   return json({
      entry,
      wLevelData: wlevel?.entry?.data?._dataJsons?.docs,
   });
}

const SECTIONS = {
   main: Main,
   talents: Talents,
   gallery: ImageGallery,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const char = loaderdata?.entry?.data?.WEngine as WEngineType;
   // console.log(loaderdata);

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={loaderdata} />
            <Talents data={char} />
            <ImageGallery data={char} />

            <ZZZUnderConstruction />
         </Entry>
      </>
   );
}

const QUERY = gql`
   query WEngine($entryId: String!) {
      WEngine(id: $entryId) {
         id
         name
         desc
         rarity {
            id
            name
            icon_item {
               url
            }
         }
         icon {
            url
         }
         icon_full {
            url
         }
         icon_big {
            url
         }
         stat_primary {
            id: name
            name
            value
         }
         stat_secondary {
            id: name
            name
            value
            pct
         }
         talent_title
         talent {
            level
            desc
         }
         slug
      }
   }
`;

const WLEVEL_QUERY = gql`
   query {
      _dataJsons {
         docs {
            id
            name
            json
         }
      }
   }
`;
