import {
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Calendar,
  ShieldCheck,
  Users,
  Settings,
  AppWindow,
  Images,
  FileText,
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
    label: 'รายการข่าวสาร',
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
    match: '/admin/ITA',
    children: [
      { label: 'รายการเอกสาร', to: '/admin/ITA' },
      { label: 'เพิ่มเอกสาร', to: '/admin/ITA/create' },

    ],
  },
  {
    label: 'จัดการบุคลากร',
    icon: Users,
    to: '/admin/personnel',
    match: '/admin/personnel',
    children: [
      { label: 'รายการบุคลากร', to: '/admin/personnel' },
      { label: 'เพิ่มบุคลากร', to: '/admin/personnel/create' },
    ],
  },
  {
    label: 'หน้าเนื้อหา',
    icon: FileText,
    to: '/admin/content',
    match: '/admin/content',
  },
  {
    label: 'รูปสไลด์หน้าแรก',
    icon: Images,
    to: '/admin/hero',
    match: '/admin/hero',
  },
  {
    label: 'จัดการ Popup',
    icon: AppWindow,
    to: '/admin/popup',
    match: '/admin/popup',
  },
  {
    label: 'เมนูบริการเจ้าหน้าที่',
    icon: LayoutGrid,
    to: '/admin/staftmenu',
    match: '/admin/staftmenu',
    children: [
      { label: 'รายการเมนู', to: '/admin/staftmenu' },
      { label: 'เพิ่มเมนู', to: '/admin/staftmenu/create' },
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
