import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

const tokens = {
  ink: '#16233D',
  paper: '#F6F3EC',
  brass: '#B8863F',
  teal: '#225C57',
  line: '#E4DECF',
  muted: '#5B6577',
  faint: '#8B93A1',
}

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
        const val = col.searchValue ? col.searchValue(row) : String((row as any)[col.key] ?? '')
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
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-sm border w-full sm:w-80"
          style={{ borderColor: tokens.line, backgroundColor: '#FFFFFF' }}
        >
          <Search className="w-4 h-4" style={{ color: tokens.faint }} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder={searchPlaceholder}
            className="w-full text-sm bg-transparent outline-none"
            style={{ color: tokens.ink }}
          />
        </div>
        <span className="text-xs ml-auto hidden sm:inline" style={{ color: tokens.faint }}>
          {filtered.length} รายการ
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-sm overflow-hidden" style={{ borderColor: tokens.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#FFFFFF', borderBottom: `1px solid ${tokens.line}` }}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3 font-medium uppercase tracking-wider text-xs ${col.className ?? ''}`}
                    style={{ color: tokens.faint }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: tokens.faint }}>
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: tokens.faint }}>
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr
                    key={rowKey(row)}
                    style={{
                      borderBottom: i < pageRows.length - 1 ? `1px solid ${tokens.line}` : undefined,
                      backgroundColor: tokens.paper,
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`} style={{ color: tokens.ink }}>
                        {col.render ? col.render(row) : String((row as any)[col.key] ?? '-')}
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
          <span className="text-xs" style={{ color: tokens.faint }}>
            หน้า {currentPage} จาก {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-sm border disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: tokens.line, color: tokens.ink }}
            >
              <ChevronLeft className="w-4 h-4" />
              ก่อนหน้า
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-sm border disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: tokens.line, color: tokens.ink }}
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

export { tokens as dataTableTokens }
