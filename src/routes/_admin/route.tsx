import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem("admin_token");

    // ถ้าไม่มี token และไม่ใช่หน้า login → เด้งไป login
    if (!token && location.pathname !== "/admin/login") {
      throw redirect({ to: "/admin/login" });
    }

    // ถ้ามี token และพยายามเข้า login → เด้งไป dashboard
    if (token && location.pathname === "/admin/login") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}