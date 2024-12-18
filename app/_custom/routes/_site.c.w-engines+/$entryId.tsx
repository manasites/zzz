// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { ImageGallery } from "./components/ImageGallery";
import { Main } from "./components/Main";
import { Talents } from "./components/Talents";
import { Modification } from "./components/Modification";
import type { WEngine as WEngineType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { WEngines } from "../../collections/w-engines";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";

// Custom Site / Collection Config Imports

// Custom Component Imports
export { entryMeta as meta };

// Loader definition - loads Entry data!
export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });

   return json({
      entry,
      wLevelData: entry?.data?.DataJsons?.docs,
   });
}

const SECTIONS = {
   main: Main,
   talents: Talents,
   modification: Modification,
   gallery: ImageGallery,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const char = loaderdata?.entry?.data?.WEngine as WEngineType;

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={loaderdata} />
            <Talents data={char} />
            <Modification data={char} />
            <ImageGallery data={char} />
         </Entry>
      </>
   );
}

const QUERY = gql`
   query WEngine($entryId: String!) {
      WEngine(id: $entryId) {
         id
         slug
         name
         desc
         comment
         icon {
            url
         }
         icon_full {
            url
         }
         icon_big {
            url
         }
         rarity {
            id
            name
            icon_item {
               url
            }
         }
         specialty {
            name
            icon {
               url
            }
         }
         stat_primary {
            stat {
               id
               name
            }
            value
         }
         stat_secondary {
            stat {
               id
               name
               fmt
               divisor
            }
            value
         }
         talent_title
         talent {
            level
            desc
         }
         modifications {
            materials {
               material {
                  id
                  slug
                  name
                  icon {
                     url
                  }
                  rarity {
                     id
                  }
               }
               qty
            }
         }
      }
      DataJsons {
         docs {
            id
            json
         }
      }
   }
`;
