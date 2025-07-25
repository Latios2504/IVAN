import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBasicInfo } from "./UserBasicInfo";
import { VolunteerProfileTab } from "./VolunteerProfileTab";
import { OrganizationProfileTab } from "./OrganizationProfileTab";
import { PartnerProfileTab } from "./PartnerProfileTab";
import { CoordinatorProfileTab } from "./CoordinatorProfileTab";
import type { UserAccountDetailDto } from "@/services/userManagementService";

interface UserProfileTabsProps {
  user: UserAccountDetailDto;
}

export function UserProfileTabs({ user }: UserProfileTabsProps) {
  const getRoleTabs = () => {
    const tabs = [
      {
        value: "basic",
        label: "Thông tin cơ bản",
        component: <UserBasicInfo user={user} />,
      },
    ];

    // Add role-specific tabs based on user role
    switch (user.roleName.toLowerCase()) {
      case "volunteer":
        tabs.push({
          value: "volunteer",
          label: "Hồ sơ Tình nguyện viên",
          component: <VolunteerProfileTab user={user} />,
        });
        break;
      case "organization":
        tabs.push({
          value: "organization",
          label: "Hồ sơ Tổ chức",
          component: <OrganizationProfileTab user={user} />,
        });
        break;
      case "partner":
        tabs.push({
          value: "partner",
          label: "Hồ sơ Đối tác",
          component: <PartnerProfileTab user={user} />,
        });
        break;
      case "volunteercoordinator":
      case "coordinator":
        tabs.push({
          value: "coordinator",
          label: "Hồ sơ Điều phối viên",
          component: <CoordinatorProfileTab user={user} />,
        });
        break;
      case "admin":
        // Admin only has basic info, no additional tab needed
        break;
      default:
        break;
    }

    return tabs;
  };

  const tabs = getRoleTabs();

  // Dynamic grid columns based on number of tabs
  const gridCols = tabs.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className={`grid w-full ${gridCols} gap-2 p-1 h-auto mb-4`}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-sm px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 space-y-4 w-full"
        >
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
