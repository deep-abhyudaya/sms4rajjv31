import { currentUser } from "@clerk/nextjs/server";
import { SidebarInner } from "./sidebar-inner";
import { getUnreadCounts } from "@/actions/notification.actions";

export async function AppSidebar() {
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string) ?? "";
  const counts = await getUnreadCounts();

  return <SidebarInner role={role} initialCounts={counts} />;
}
