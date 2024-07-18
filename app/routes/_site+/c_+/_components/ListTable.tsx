import { useState } from "react";

import {
   type AccessorKeyColumnDefBase,
   type VisibilityState,
   type AccessorKeyColumnDef,
   type ColumnFiltersState,
   type SortingState,
   type PaginationState,
   useReactTable,
   getCoreRowModel,
   getSortedRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
} from "@tanstack/react-table";

import type { Collection } from "~/db/payload-types";

import { fuzzyFilter } from "./fuzzyFilter";
import { GridView } from "./GridView";
import type { TableFilters } from "./List";
import { ListFilters } from "./ListFilters";
import { ListPager } from "./ListPager";
import { ListView } from "./ListView";

export function ListTable({
   data,
   columns,
   collection,
   columnViewability,
   filters,
   viewType,
   gridView,
}: {
   data: any;
   columns: AccessorKeyColumnDefBase<any>[];
   collection: Collection;
   columnViewability?: VisibilityState;
   viewType: "list" | "grid";
   filters?: TableFilters;
   gridView?: AccessorKeyColumnDef<any>;
}) {
   // Table state definitions
   const [tabletData] = useState(() => [...data?.listData?.docs]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [globalFilter, setGlobalFilter] = useState("");
   const [viewMode, setViewMode] = useState(viewType ?? "list");
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      columnViewability ?? {},
   );
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 60,
   });

   // Add grid view column to the beginning of the columns array if exists
   const updatedColumns =
      gridView && viewMode === "grid"
         ? [gridView, ...columns.slice(1)]
         : columns;

   const table = useReactTable({
      data: tabletData,
      columns: updatedColumns,
      filterFns: {},
      state: {
         columnFilters,
         sorting,
         pagination,
         globalFilter,
         columnVisibility,
      },
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      onGlobalFilterChange: setGlobalFilter,
      onColumnVisibilityChange: setColumnVisibility,
      globalFilterFn: fuzzyFilter,
   });

   return (
      <>
         <ListFilters
            collection={collection}
            filters={filters}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            setGlobalFilter={setGlobalFilter}
            viewType={viewMode}
            setViewMode={setViewMode}
         />
         {viewMode === "list" ? (
            <ListView table={table} />
         ) : (
            <GridView table={table} />
         )}
         <ListPager table={table} />
      </>
   );
}
