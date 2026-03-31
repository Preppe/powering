import { useRouter } from "@tanstack/react-router";
import { useSidebar } from "#/lib/sidebar-context";
import { logoutFn, setAccessToken } from "#/lib/api/auth";

export function TopNavBar() {
  const router = useRouter();
  const { collapsed } = useSidebar();

  async function logout() {
    try { await logoutFn() } catch {}
    setAccessToken(null);
    router.navigate({ to: "/auth" });
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-xl flex justify-between items-center h-16 px-8 transition-all duration-200 ${collapsed ? "ml-16 w-[calc(100%-4rem)]" : "ml-64 w-[calc(100%-16rem)]"}`}
    >
      <div />

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button onClick={logout} title="Logout" className="text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
