"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useNotifications } from "@/hooks/useNotifications";
import ThemeIcon from "@/components/theme/ThemeIcon";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Header");
  const { data: session } = useSession();
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const userName = session?.user?.name || session?.user?.email || "";
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  const isIntroPage = pathname === "/";

  const hideBecomePartner =
    pathname === "/register/partner" ||
    pathname.startsWith("/register/partner/");

  const notif = useNotifications();

  const showLogoutMessage = searchParams.get("logout") === "1";
  const showUnauthorizedMessage = searchParams.get("error") === "unauthorized";

  const [visibleLogoutMessage, setVisibleLogoutMessage] = useState(showLogoutMessage);
  const [visibleUnauthorizedMessage, setVisibleUnauthorizedMessage] = useState(showUnauthorizedMessage);

  useEffect(() => {
    if (showLogoutMessage || showUnauthorizedMessage) {
      const timer = setTimeout(() => {
        setVisibleLogoutMessage(false);
        setVisibleUnauthorizedMessage(false);
        router.replace(pathname);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutMessage, showUnauthorizedMessage, pathname, router]);

  return (
    <header
      id="main-header"
      className={
        "w-full bg-black text-white relative " +
        (isIntroPage
          ? "opacity-0 transition-opacity duration-[2400ms] ease-out"
          : "opacity-100")
      }
    >
      {visibleLogoutMessage && (
        <div className="w-full bg-green-600 text-white text-center py-2 text-sm">
          {t("logoutMessage")}
        </div>
      )}

      {visibleUnauthorizedMessage && (
        <div className="w-full bg-red-600 text-white text-center py-2 text-sm">
          {t("unauthorizedMessage")}
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">

        <div className="flex items-center gap-4">
          <Link href="/home" className="text-xl font-semibold tracking-wide">
            Locaplux
          </Link>

          <p className="text-sm text-gray-300 hidden md:block leading-none">
            {t("slogan")}
          </p>
        </div>

        <div className="flex items-center gap-4">

          <LanguageSwitcher />

          {!hideBecomePartner && (
            <Link
              href="/register/partner"
              className="text-[12px] px-3 py-1.5 border border-white rounded hover:bg-white hover:text-black transition"
            >
              {t("becomePartner")}
            </Link>
          )}

          {session && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenNotif((v) => !v)}
                className="relative px-2 py-1 rounded hover:bg-white/10 transition"
              >
                <span className="text-xl">🔔</span>

                {notif && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </button>

              {openNotif && (
                <div className="absolute right-0 mt-2 w-64 
                                bg-white dark:bg-[#18181A] 
                                text-black dark:text-white 
                                border border-gray-200 dark:border-white/10
                                rounded-md shadow-lg text-[13px] overflow-hidden z-20">

                  <div className="px-3 py-2 font-semibold bg-gray-100 dark:bg-white/5">
                    {t("notifications")}
                  </div>

                  {!notif && (
                    <div className="px-3 py-3 text-gray-600 dark:text-gray-400">
                      {t("noNotifications")}
                    </div>
                  )}

                  {notif && (
                    <div className="px-3 py-3 border-b border-gray-200 dark:border-white/10">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("newOrder")}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Commande #{notif.payload.orderId} — {notif.payload.total} €
                      </p>
                    </div>
                  )}

                  <Link
                    href="/partner/notifications"
                    className="block px-3 py-2 text-blue-600 dark:text-blue-400 
                               hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    {t("seeAllNotifications")}
                  </Link>
                </div>
              )}
            </div>
          )}

          <ThemeIcon />

          {session && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/10 transition"
              >
                <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-[13px] font-semibold">
                  {initial}
                </div>
                <span className="hidden sm:inline text-[13px] max-w-[120px] truncate">
                  {userName}
                </span>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-44 
                                bg-white dark:bg-[#18181A] 
                                text-black dark:text-white 
                                border border-gray-200 dark:border-white/10
                                rounded-md shadow-lg text-[13px] overflow-hidden z-20">

                  <Link href="/account/profile" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5">
                    {t("profile")}
                  </Link>

                  <Link href="/account/orders" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5">
                    {t("orders")}
                  </Link>

                  {session?.user?.role === "partner" && (
                    <Link
                      href="/partner/dashboard"
                      className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 font-semibold text-blue-600"
                    >
                      {t("partnerDashboard")}
                    </Link>
                  )}

                  {session?.user?.role === "admin" && (
                    <Link
                      href="/admin/partners"
                      className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 font-semibold text-red-600"
                    >
                      {t("adminDashboard")}
                    </Link>
                  )}

                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 border-t border-gray-200 dark:border-white/10 text-red-600"
                    onClick={() => signOut({ callbackUrl: "/home?logout=1" })}
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
