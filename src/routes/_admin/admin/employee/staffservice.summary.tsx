import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type { System } from '@/interface/staff_info'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'


export const Route = createFileRoute('/_admin/admin/employee/staffservice/summary')({
  component: StaffSummaryPage,
})

function StaffSummaryPage() {
  const { data, isLoading } = useQuery<System[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      const resp = await requestAPI<System[]>({ method: 'GET', url: '/staff' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  // Adjust field names below to match the real System (staff) shape if it differs.
  const columns: DataTableColumn<System>[] = [
    {
      key: 'name',
      header: 'ชื่อ-สกุล',
      render: (row: any) => row.name ?? row.full_name ?? '-',
      searchValue: (row: any) => row.name ?? row.full_name ?? '',
    },
    {
      key: 'position',
      header: 'ตำแหน่ง',
      render: (row: any) => row.position ?? row.role ?? '-',
    },
    {
      key: 'department',
      header: 'หน่วยงาน',
      render: (row: any) => row.department ?? row.unit ?? '-',
    },
    {
      key: 'status',
      header: 'สถานะ',
      render: (row: any) => (
        <span
          className="text-xs px-2 py-0.5 rounded-sm border"
          style={{
            borderColor: '#E4DECF',
            color: row.status === 'active' ? '#225C57' : '#8B93A1',
          }}
        >
          {row.status ?? 'ปฏิบัติงาน'}
        </span>
      ),
    },
  ]

  return (
    <SummaryPageShell
      crumbs={[
        { label: 'ภาพรวมระบบ', to: '/admin/dashboard' },
        { label: 'เจ้าหน้าที่' },
      ]}
      title="เจ้าหน้าที่ทั้งหมด"
      subtitle="รายชื่อบุคลากรทั้งหมดในระบบ ค้นหาและจัดการได้จากตารางด้านล่าง"
    >
      <DataTable
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหาเจ้าหน้าที่..."
        emptyLabel="ยังไม่มีเจ้าหน้าที่ในระบบ"
        rowKey={(row: any) => row.id ?? row._id ?? JSON.stringify(row)}
      />
    </SummaryPageShell>
  )
}
