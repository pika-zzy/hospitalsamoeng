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

  const formatDate = (d: string) => {
    if (!d) return '-'
    const date = new Date(d)
    return isNaN(date.getTime()) ? d : date.toLocaleDateString('th-TH')
  }

  const columns: DataTableColumn<ActivityInfo>[] = [
    {
      key: 'title',
      header: 'ชื่อกิจกรรม',
      render: (row) => row.title,
      searchValue: (row) => row.title,
    },
    {
      key: 'start_date',
      header: 'วันที่เริ่ม',
      render: (row) => formatDate(row.start_date),
    },
    {
      key: 'end_date',
      header: 'วันที่สิ้นสุด',
      render: (row) => formatDate(row.end_date),
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
        rowKey={(row) => row.id}
      />
    </SummaryPageShell>
  )
}
