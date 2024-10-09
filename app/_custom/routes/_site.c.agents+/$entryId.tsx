// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

// Custom Site / Collection Config Imports

// Custom Component Imports
import { ImageGallery } from "./components/ImageGallery";
import { Main } from "./components/Main";
import { Skills } from "./components/Skills";
import { Core } from "./components/Core";
import { Talents } from "./components/Talents";
import { Ascension } from "./components/Ascension";
import { SkillMaterials } from "./components/SkillMaterials";
import { Totals } from "./components/Totals";
import { Profile } from "./components/Profile";
import type { Agent as AgentType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { Agents } from "../../collections/agents";

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
   });
}

const SECTIONS = {
   main: Main,
   skills: Skills,
   core: Core,
   talents: Talents,
   ascension: Ascension,
   skillmats: SkillMaterials,
   totals: Totals,
   profile: Profile,
   gallery: ImageGallery,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const char = entry?.data?.Agent as AgentType;
   console.log(char);

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={char} />
            <Skills data={char} />
            <Core data={char} />
            <Talents data={char} />
            <Ascension data={char} />
            <SkillMaterials data={char} />
            <Totals data={char} />
            <Profile data={char} />
            <ImageGallery data={char} />
         </Entry>
      </>
   );
}

const QUERY = gql`
   query Agent($entryId: String!) {
      Agent(id: $entryId) {
         id
         slug
         name
         name_code
         icon {
            url
         }
         icon_full {
            url
         }
         icon_general {
            url
         }
         icon_round {
            url
         }
         rarity {
            id
            name
            icon {
               url
            }
         }
         damage_type {
            id
            name
            icon {
               url
            }
         }
         damage_element {
            id
            name
            icon {
               url
            }
         }
         character_camp {
            id
            name
            icon {
               url
            }
         }
         stats {
            stat {
               id
               name
               fmt
               divisor
               icon {
                  url
               }
            }
            base
            growth
         }
         skills {
            skill_type {
               name
               icon {
                  url
               }
            }
            description {
               name
               desc
            }
            modifiers {
               title
               params
            }
            materials {
               lv
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
         core_skill {
            skill_type {
               name
               icon {
                  url
               }
            }
            levels {
               level
               descs {
                  title
                  desc
               }
            }
         }
         talents {
            name
            desc
            desc_flavor
         }
         ascension_data {
            asc
            lv_min
            lv_max
            stat_adv {
               stat {
                  id
                  name
                  icon {
                     url
                  }
               }
               value
            }
            stat_add {
               stat {
                  id
                  name
                  icon {
                     url
                  }
               }
               value
            }
            materials {
               material {
                  id
                  slug
                  name
                  rarity {
                     id
                  }
                  icon {
                     url
                  }
               }
               qty
            }
         }
         profile_info
         profile_desc
         height
         bday
      }
   }
`;
