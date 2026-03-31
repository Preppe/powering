import { Link, useRouter } from "@tanstack/react-router";
import { useSidebar } from "#/lib/sidebar-context";
import { logoutFn, setAccessToken } from "#/lib/api/auth";

export function SideNavBar() {
  const router = useRouter();
  const { collapsed, toggle } = useSidebar();

  async function logout() {
    try { await logoutFn() } catch {}
    setAccessToken(null);
    router.navigate({ to: "/auth" });
  }

  return (
    <aside className={`h-screen fixed left-0 top-0 bg-[#001b3d] flex flex-col py-6 z-50 shadow-2xl transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className={`mb-10 overflow-hidden ${collapsed ? "px-0 flex justify-center" : "px-6"}`}>
        {collapsed ? (
          <span className="material-symbols-outlined text-white text-2xl">directions_boat</span>
        ) : (
          <>
            <h1 className="text-xl font-bold text-white tracking-widest uppercase font-manrope">Powering</h1>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <Link
          to="/vehicles"
          className={`flex items-center gap-3 py-4 font-manrope text-sm font-semibold tracking-tight transition-all text-[#c2e3ff] opacity-70 hover:opacity-100 hover:bg-[#003f87] ${collapsed ? "justify-center px-0" : "px-6"}`}
          activeProps={{
            className: `flex items-center gap-3 py-4 font-manrope text-sm font-semibold tracking-tight transition-all bg-[#0056b3] text-white border-l-4 border-[#99cbff] opacity-100 ${collapsed ? "justify-center px-0" : "px-6"}`,
          }}
          activeOptions={{ exact: true }}
        >
          <span className="material-symbols-outlined">directions_car</span>
          {!collapsed && "Automezzi"}
        </Link>
        <Link
          to="/branches"
          className={`flex items-center gap-3 py-4 font-manrope text-sm font-semibold tracking-tight transition-all text-[#c2e3ff] opacity-70 hover:opacity-100 hover:bg-[#003f87] ${collapsed ? "justify-center px-0" : "px-6"}`}
          activeProps={{
            className: `flex items-center gap-3 py-4 font-manrope text-sm font-semibold tracking-tight transition-all bg-[#0056b3] text-white border-l-4 border-[#99cbff] opacity-100 ${collapsed ? "justify-center px-0" : "px-6"}`,
          }}
          activeOptions={{ exact: true }}
        >
          <span className="material-symbols-outlined">domain</span>
          {!collapsed && "Filiali"}
        </Link>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 pt-6 space-y-1">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 py-3 font-manrope text-sm font-semibold text-error hover:bg-error/10 transition-all ${collapsed ? "justify-center px-0" : "px-6"}`}
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          {!collapsed && "Logout"}
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="mt-4 mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        title={collapsed ? "Espandi" : "Comprimi"}
      >
        <span className="material-symbols-outlined text-2xl">{collapsed ? "chevron_right" : "chevron_left"}</span>
      </button>
    </aside>
  );
}
