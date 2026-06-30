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

  // Adjust field names below to match the real NewsInfo shape if it differs.
  const columns: DataTableColumn<NewsInfo>[] = [
    {
      key: 'title',
      header: 'หัวข้อข่าว',
      render: (row: any) => row.title ?? row.name ?? '-',
      searchValue: (row: any) => row.title ?? row.name ?? '',
    },
    {
      key: 'category',
      header: 'หมวดหมู่',
      render: (row: any) => row.category ?? row.type ?? '-',
    },
    {
      key: 'created_at',
      header: 'วันที่เผยแพร่',
      render: (row: any) => {
        const d = row.created_at ?? row.createdAt ?? row.date
        if (!d) return '-'
        const date = new Date(d)
        return isNaN(date.getTime()) ? String(d) : date.toLocaleDateString('th-TH')
      },
    },
    {
      key: 'status',
      header: 'สถานะ',
      render: (row: any) => (
        <span
          className="text-xs px-2 py-0.5 rounded-sm border"
          style={{
            borderColor: '#E4DECF',
            color: row.status === 'published' || row.status === 'active' ? '#225C57' : '#8B93A1',
          }}
        >
          {row.status ?? 'เผยแพร่แล้ว'}
        </span>
      ),
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
        rowKey={(row: any) => row.id ?? row._id ?? JSON.stringify(row)}
      />
    </SummaryPageShell>
  )
}
