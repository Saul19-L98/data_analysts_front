import { LayoutDashboard } from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavWorkspaces } from '@/components/nav-workspaces'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
      isActive: true,
    },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-border !p-2">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <LayoutDashboard className="!size-5" />
                <span className="text-base font-semibold">Data Helper</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavWorkspaces />
      </SidebarContent>
    </Sidebar>
  )
}
