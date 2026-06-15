import { auth } from "@/auth";
import UserAvatarDropdown from "@/components/dashboard/avatar/user-avatar-dropdown";
import DashboardNotification from "@/components/dashboard/notifications/dashboard-notification";
import logo from "@/public/images/logo/logo.png";
import BarButton from "@/components/dashboard/sidebar/bar-button";
import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { getAllNotificationAction } from "@/actions/notification-actions";
import { getNavConfigAction } from "@/actions/nav-config-actions";
import ClientSidebarWrapper from "@/components/dashboard/sidebar/client-sidebar-wrapper";
import { DashboardHeader } from "@soab42/dashboard-sidebar";

// Icons are injected client-side in ClientSidebarWrapper to avoid RSC serialisation issues.

const MinimalLayout = async ({ children }) => {
  const session = await auth();
  const [data, navConfig] = await Promise.all([
    getAllNotificationAction(),
    getNavConfigAction(),
  ]);

  const { role, token, id, enabledFeatures } = session.user;

  return (
    <>
      <SidebarProvider>

        <DashboardHeader
          leftSlot={<BarButton />}
          logoSlot={
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                className="w-10 md:w-11 3xl:w-20 fhd:w-24 2k:w-32 3k:w-40 4k:w-50"
                src={logo}
                alt="logo"
              />
            </Link>
          }
          rightSlot={
            <>
              <DashboardNotification session={session} initialNotifications={data} />
              <UserAvatarDropdown />
            </>
          }
        />

        <main className="flex items-start w-full">
          {/* Icons injected client-side — pass plain config here */}
          <ClientSidebarWrapper
            config={navConfig}
            userId={id ?? ""}
            role={role}
            enabledFeatures={enabledFeatures ?? []}
            token={token}
          />

          {/* main content */}
          <div className="dashboard-container">
            {children}
          </div>
        </main>

      </SidebarProvider>
    </>
  );
};

export default MinimalLayout;
