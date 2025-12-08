import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  title?: string
  description?: string
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function DataTable<T extends { id: string | number }>({
  title,
  description,
  columns,
  data,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={!title && !description ? "pt-6" : ""}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {typeof column.accessor === "function"
                        ? column.accessor(row)
                        : (row[column.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
