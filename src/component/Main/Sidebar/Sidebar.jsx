import { useState } from "react";
import {
  Home,
  LayoutList,
  MessageSquareText,
  ShoppingBag,
  Crosshair,
  FileText,
  Newspaper,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", to: "/", icon: Home },
  { label: "Category Manage", to: "/categories", icon: LayoutList },
  { label: "Message", to: "/messages", icon: MessageSquareText },
  { label: "Order Manage", to: "/orders", icon: ShoppingBag },
  { label: "OLDCRISIS", to: "/oldcrisis", icon: Crosshair },
  { label: "Template Manage", to: "/templates", icon: FileText },
  { label: "News Manage", to: "/news", icon: Newspaper },
  { label: "User Manage", to: "/users", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings, hasChevron: true },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("User Logged Out!");
    navigate("/auth/sign-in");
  };

  return (
    <>
      {/* Mobile hamburger (3-bar) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border bg-white p-2 shadow lg:hidden"
        aria-label="Open menu"
        aria-expanded={mobileOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden ${
          mobileOpen ? "block" : "hidden"
        }`}
      />

      {/* Sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r bg-white shadow-sm transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div className="flex items-center gap-3  px-4 py-4">
          {/* Close (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto inline-flex rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex h-[calc(100%-112px)] flex-col justify-between overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} className="group relative">
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-r-xl px-3 py-3 transition-colors",
                        isActive
                          ? "bg-gray-900 text-white hover:bg-gray-900 duration-500"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                    {item.hasChevron && (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t pt-4">
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
        from="right"
        title="You want to logout?"
        message="Are you sure you want to logout?"
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
}
