import { auth } from "@/auth";
import UserAvatarDropdown from "@/components/dashboard/avatar/user-avatar-dropdown";
import DashboardNotification from "@/components/dashboard/notifications/dashboard-notification";
import logo from "@/public/images/logo/logo.png";
import BarButton from "@/components/dashboard/sidebar/bar-button";
import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { getAllNotificationAction } from "@/actions/notification-actions";
import { crmSidebarConfig } from "@bixcel/navigation-config";
import ClientSidebarWrapper from "@/components/dashboard/sidebar/client-sidebar-wrapper";

// Icons are injected client-side in ClientSidebarWrapper to avoid RSC serialisation issues.

const MinimalLayout = async ({ children }) => {
  const session = await auth();
  const data = await getAllNotificationAction();

  const { role, token, id, enabledFeatures } = session.user;

  return (
    <>
      <SidebarProvider>

        <header className="h-11 lg:h-14 3xl:h-20 fhd:h-24 2k:h-32 3k:h-40 4k:h-50 !z-40">
          <div className="fixed top-0 inset-x-0 w-full h-11 lg:h-14 3xl:h-20 fhd:h-24 2k:h-32 3k:h-40 4k:h-50 inline-flex items-center justify-center gap-5 bg-white px-4 md:px-5 lg:px-6 3xl:px-8 fhd:px-12 2k:px-14 3k:px-17 4k:px-22 border-b border-b-secondaryText border-opacity-10 !z-40">
            <nav className="w-full h-full flex items-center justify-between">
              <BarButton />
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="">
                  <Image
                    className="w-10 md:w-11 3xl:w-20 fhd:w-24 2k:w-32 3k:w-40 4k:w-50"
                    src={logo}
                    alt="logo"
                  />
                </div>
              </Link>
              <div className="flex items-center gap-3 3xl:gap-5 fhd:gap-6 2k:gap-8 3k:gap-12 4k:gap-16">
                <DashboardNotification session={session} initialNotifications={data} />
                <UserAvatarDropdown />
              </div>
            </nav>
          </div>
        </header>

        <main className="flex items-start w-full">
          {/* Icons injected client-side — pass plain config here */}
          <ClientSidebarWrapper
            config={crmSidebarConfig}
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
