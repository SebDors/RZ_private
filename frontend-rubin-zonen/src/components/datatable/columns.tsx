"use client"

import type { ColumnDef } from "@tanstack/react-table" // flexRender is a value, not a type
import type { Diamant } from "@/models/models"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Diamant, unknown>[] = [
  /*
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  */
  {
    accessorKey: "availability",
    header: "Availability",
  },
  {
    accessorKey: "stock_id",
    header: "ID",
  },
  {
    accessorKey: "lab",
    header: "Lab",
  },
  {
    accessorKey: "certificate_filename",
    header: "Certificate",
    cell: ({ row }) => {
      const certificateFilename = row.getValue("certificate_filename") as string;
      // Assuming certificate_file is a URL or a path that can be linked
      return (
        <a href={certificateFilename} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {certificateFilename ? "View Certificate" : "N/A"}
        </a>
      );
    },
  },
  {
    accessorKey: "shape",
    header: "Shape",
  },
  {
    accessorKey: "weight",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Carat
          <ArrowUpDown className="ml-1 h-4 " />
        </Button>
      )
    },
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "clarity",
    header: "Clarity",
  },
  {
    accessorKey: "cut_grade",
    header: "Cut Grade",
  },
  {
    accessorKey: "polish",
    header: "Polish",
  },
  {
    accessorKey: "symmetry",
    header: "Symmetry",
  },
  {
    accessorKey: "fluorescence_intensity",
    header: "Fluorescence",
  },
  {
    accessorKey: "depth_pct",
    header: "Depth%",
  },
  {
    accessorKey: "table_pct",
    header: "Table%",
  },
  {
    accessorKey: "measurements",
    header: "Measurements",
  },
  {
    accessorKey: "rap",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rap
            <ArrowUpDown className="ml-1 h-4 " />
          </Button>
        )
    },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("rap"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "disc",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Discount
            <ArrowUpDown className="ml-1 h-4 " />
          </Button>
        )
    },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("disc"))
        return <div className="text-right font-medium">{amount}%</div>
    },
  },
  {
    accessorKey: "price_carat",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price/Carat
            <ArrowUpDown className="ml-1 h-4 " />
          </Button>
        )
    },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price_carat"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "price",
    accessorFn: row => row.weight * row.price_carat,
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-1 h-4 " />
          </Button>
        )
    },
    cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price)
        return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const diamant = row.original;
      const meta = table.options.meta as { navigateToDetail: (id: string) => void };
      
      return (
        <Button onClick={() => meta.navigateToDetail(diamant.stock_id)}>Details</Button>
      )
    },
  },
]
