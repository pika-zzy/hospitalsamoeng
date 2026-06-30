import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type { NewsInfo } from '@/interface/newinfo'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'


export const Route = createFileRoute('/_admin/admin/news/news/summary')({
  component: NewsSummaryPage,
})

function NewsSummaryPage() {
  const { data, isLoading } = useQuery<NewsInfo[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo[]>({ method: 'GET', url: '/news' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const columns: DataTableColumn<NewsInfo>[] = [
    {
      key: 'title',
      header: 'หัวข้อข่าว',
      render: (row) => row.title,
      searchValue: (row) => row.title,
    },
    {
      key: 'type',
      header: 'ประเภท',
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded-sm border border-line text-teal">
          {row.type}
        </span>
      ),
      searchValue: (row) => row.type,
    },
    {
      key: 'date',
      header: 'วันที่เผยแพร่',
      render: (row) => {
        if (!row.date) return '-'
        const date = new Date(row.date)
        return isNaN(date.getTime()) ? row.date : date.toLocaleDateString('th-TH')
      },
    },
  ]

  return (
    <SummaryPageShell
      crumbs={[
        { label: 'ภาพรวมระบบ', to: '/admin/dashboard' },
        { label: 'ข่าวประชาสัมพันธ์' },
      ]}
      title="ข่าวประชาสัมพันธ์ทั้งหมด"
      subtitle="รายการข่าวทั้งหมดในระบบ ค้นหาและจัดการได้จากตารางด้านล่าง"
    >
      <DataTable
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหาข่าว..."
        emptyLabel="ยังไม่มีข่าวในระบบ"
        rowKey={(row) => row.id}
      />
    </SummaryPageShell>
  )
}
