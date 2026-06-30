import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type ActivityInfo from '@/interface/activity_info'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'

export const Route = createFileRoute('/_admin/admin/activity/activity/summary')({
  component: ActivitySummaryPage,
})

function ActivitySummaryPage() {
  const { data, isLoading } = useQuery<ActivityInfo[]>({
    queryKey: ['activity'],
    queryFn: async () => {
      const resp = await requestAPI<ActivityInfo[]>({ method: 'GET', url: '/activities' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  // Adjust field names below to match the real ActivityInfo shape if it differs.
  const columns: DataTableColumn<ActivityInfo>[] = [
    {
      key: 'title',
      header: 'ชื่อกิจกรรม',
      render: (row: any) => row.title ?? row.name ?? '-',
      searchValue: (row: any) => row.title ?? row.name ?? '',
    },
    {
      key: 'location',
      header: 'สถานที่',
      render: (row: any) => row.location ?? row.place ?? '-',
    },
    {
      key: 'date',
      header: 'วันที่จัดกิจกรรม',
      render: (row: any) => {
        const d = row.date ?? row.event_date ?? row.created_at
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
        { label: 'กิจกรรม' },
      ]}
      title="กิจกรรมทั้งหมด"
      subtitle="รายการกิจกรรมทั้งหมดในระบบ ค้นหาและจัดการได้จากตารางด้านล่าง"
    >
      <DataTable
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหากิจกรรม..."
        emptyLabel="ยังไม่มีกิจกรรมในระบบ"
        rowKey={(row: any) => row.id ?? row._id ?? JSON.stringify(row)}
      />
    </SummaryPageShell>
  )
}
