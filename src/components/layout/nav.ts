import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  ShieldCheck,
  Users,
  Settings,
} from 'lucide-react'

// Sidebar navigation model — shared between AdminShell (renders the sidebar)
// and the permission-management page (lists menus to grant access to).
export type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  match: string // prefix used to decide "active" state
  children?: { label: string; to: string }[]
}

export const NAV: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/admin/dashboard',
    match: '/admin/dashboard',
  },
  {
    label: 'ข่าวประชาสัมพันธ์',
    icon: Megaphone,
    to: '/admin/news/news/summary',
    match: '/admin/news',
    children: [
      { label: 'รายการข่าว', to: '/admin/news/news/summary' },
      { label: 'เพิ่มข่าว', to: '/admin/news' },
    ],
  },
  {
    label: 'กิจกรรม',
    icon: Calendar,
    to: '/admin/activity/activity/summary',
    match: '/admin/activity',
    children: [
      { label: 'รายการกิจกรรม', to: '/admin/activity/activity/summary' },
      { label: 'เพิ่มกิจกรรม', to: '/admin/activity' },
    ],
  },
  {
    label: 'ITA',
    icon: ShieldCheck,
    to: '/admin/ITA',
    match: '/',
    children: [
      { label: 'รายการเอกสาร', to: '/admin/ITA' },
      { label: 'ปีงบประมาณ', to: '' },
    ],
  },
  {
    label: 'บุคลากร',
    icon: Users,
    to: '/admin/dashboard',
    match: '/',
    children: [
      { label: 'รายชื่อบุคลากร', to: '' },
      { label: 'เพิ่มบุคลากร', to: '' },
    ],
  },
  {
    label: 'ตั้งค่าระบบ',
    icon: Settings,
    to: '/admin/employee/staffservice/summary',
    match: '/admin/employee',
    children: [
      { label: 'ข้อมูลผู้ใช้งาน', to: '/admin/employee/staffservice/summary' },
      { label: 'จัดการสิทธิ์ผู้ใช้งาน', to: '/admin/employee/usermanetmint' },
    ],
  },
]
