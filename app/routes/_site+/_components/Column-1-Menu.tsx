import { Link, useLocation, useRouteLoaderData } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import type { Site, User } from "~/db/payload-types";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { Staff } from "~/routes/_auth+/components/Staff";
import { NewSiteModal } from "~/routes/_site+/action+/new-site-modal";
import { DarkModeToggle } from "~/routes/_site+/action+/theme-toggle";

import { SidebarItem } from "./SidebarItem";

export function ColumnOneMenu({ site }: { site?: Site }) {
   const { following, siteSlug } = useRouteLoaderData("root") as {
      following: User["sites"];
      siteSlug: string;
   };

   const isFollowing = following && following?.length > 0;

   const location = useLocation();

   return (
      <>
         {site && (
            <LoggedOut>
               <div className="relative flex items-center justify-center pb-3">
                  <SidebarItem isLoggedOut site={site} />
               </div>
            </LoggedOut>
         )}
         <menu className="w-full justify-between max-laptop:flex max-laptop:gap-3">
            <LoggedIn>
               <a
                  className="border-2 border-zinc-400/60 dark:border-zinc-600 transition duration-300 shadow-zinc-300 dark:shadow-zinc-900
                     active:translate-y-0.5 dark:hover:border-zinc-500 rounded-2xl flex items-center mb-3 from-white to-zinc-100
                     justify-center laptop:size-11 dark:from-dark450 dark:to-dark350 bg-gradient-to-br shadow hover:border-zinc-400 mx-auto"
                  href="https://mana.wiki"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20"
                     fill="currentColor"
                     className="size-5"
                  >
                     <path
                        fill-rule="evenodd"
                        d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                        clip-rule="evenodd"
                     />
                  </svg>
               </a>
               {isFollowing && (
                  <div className="border-t border-zinc-300 dark:border-dark350 border-dashed mx-5 mb-3" />
               )}
               {!isFollowing && site ? (
                  <div className="relative flex items-center justify-center pb-3">
                     <SidebarItem site={site} />
                  </div>
               ) : (
                  <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                     <ul
                        className="text-center max-laptop:flex max-laptop:flex-grow
                           max-laptop:gap-3 laptop:mb-4 laptop:space-y-3"
                     >
                        {following?.map((item) => (
                           <li key={item.id}>
                              <div className="relative flex items-center justify-center">
                                 <SidebarItem site={item} siteSlug={siteSlug} />
                              </div>
                           </li>
                        ))}
                     </ul>
                  </div>
               )}
               {isFollowing && (
                  <div className="border-t border-zinc-300 dark:border-dark350 border-dashed mx-5 mb-3" />
               )}
               <div className="absolute bottom-0 left-0 w-full backdrop-blur-sm py-3">
                  <div className="flex items-center justify-center flex-col gap-1">
                     <Staff>
                        <a
                           target="_blank"
                           href="/admin"
                           className="text-zinc-400 dark:text-zinc-500 size-10 rounded-full dark:hover:bg-bg2Dark hover:bg-zinc-50 flex items-center justify-center"
                        >
                           <Icon name="lock" size={18} />
                        </a>
                     </Staff>
                     <section className="z-50 flex h-14 items-center justify-end gap-2.5 max-laptop:hidden">
                        <Link
                           prefetch="intent"
                           to="/user/account"
                           className="border-2 border-zinc-300 dark:border-zinc-700 transition duration-300 
                              active:translate-y-0.5 dark:hover:border-zinc-600 rounded-2xl flex items-center 
                              justify-center laptop:size-11 bg-3 shadow shadow-1 hover:border-zinc-400"
                        >
                           <Icon name="user" size={22} />
                        </Link>
                     </section>
                  </div>
               </div>
               <NewSiteModal />
            </LoggedIn>
            <LoggedOut>
               <div className="absolute bottom-4 left-0 w-full">
                  <div className="flex items-center justify-center flex-col gap-3">
                     <DarkModeToggle />
                     <Link
                        to={`/login?redirectTo=${location.pathname}`}
                        className="border-2 border-zinc-300 dark:border-zinc-700 transition duration-300 
                        active:translate-y-0.5 dark:hover:border-zinc-600 rounded-2xl flex items-center 
                        justify-center laptop:size-11 bg-3 shadow shadow-1 hover:border-zinc-400"
                     >
                        <Icon name="user" size={20} />
                     </Link>
                  </div>
               </div>
            </LoggedOut>
         </menu>
      </>
   );
}
