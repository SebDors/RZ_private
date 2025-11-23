"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Diamant } from "@/models/models"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Diamant>[] = [
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
          Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
    accessorKey: "price_carat",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price/Carat
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
    id: "actions",
    cell: ({ row, table }) => {
      const diamant = row.original
      const meta = table.options.meta as { navigateToDetail: (id: string) => void };
      
      return (
        <Button onClick={() => meta.navigateToDetail(diamant.stock_id)}>Show Details</Button>
      )
    },
  },
]
