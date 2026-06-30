import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

export interface DataTableColumn<T> {
  key: string
  header: string
  /** Render the cell. Defaults to String(row[key]) */
  render?: (row: T) => React.ReactNode
  /** Used for search matching when no custom searchValue is given */
  searchValue?: (row: T) => string
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchPlaceholder?: string
  pageSize?: number
  isLoading?: boolean
  emptyLabel?: string
  rowKey: (row: T) => string | number
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'ค้นหา...',
  pageSize = 10,
  isLoading,
  emptyLabel = 'ไม่พบข้อมูล',
  rowKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.trim().toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.searchValue ? col.searchValue(row) : String((row as Record<string, unknown>)[col.key] ?? '')
        return val.toLowerCase().includes(q)
      }),
    )
  }, [data, query, columns])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-line bg-white w-full sm:w-80">
          <Search className="w-4 h-4 text-faint" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder={searchPlaceholder}
            className="w-full text-sm bg-transparent outline-none text-ink"
          />
        </div>
        <span className="text-xs ml-auto hidden sm:inline text-faint">
          {filtered.length} รายการ
        </span>
      </div>

      {/* Table */}
      <div className="border border-line rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-line">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3 font-medium uppercase tracking-wider text-xs text-faint ${col.className ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-faint">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-faint">
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr
                    key={rowKey(row)}
                    className={`bg-paper ${i < pageRows.length - 1 ? 'border-b border-line' : ''}`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-ink ${col.className ?? ''}`}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-faint">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-sm border border-line text-ink disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              ก่อนหน้า
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-sm border border-line text-ink disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
