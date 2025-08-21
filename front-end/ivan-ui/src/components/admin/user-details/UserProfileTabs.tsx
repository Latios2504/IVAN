import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBasicInfo } from "./UserBasicInfo";
import { VolunteerProfileTab } from "./VolunteerProfileTab";
import { OrganizationProfileTab } from "./OrganizationProfileTab";
import { PartnerProfileTab } from "./PartnerProfileTab";
import { CoordinatorProfileTab } from "./CoordinatorProfileTab";
import type { UserDetailsDto } from "@/types/userManagement";

interface UserProfileTabsProps {
  user: UserDetailsDto;
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

    // Determine user role from different possible properties
    let roleName = "";

    // Check if user has roleName property (Admin/Coordinator case)
    if (user?.roleName) {
      roleName = user.roleName;
    }
    // Check if user has RoleName property (alternative casing)
    else if (user?.RoleName) {
      roleName = user.RoleName;
    }
    // Infer role from profile type (for volunteer/organization/partner)
    else if (user?.volunteerId || user?.studentId || user?.university) {
      roleName = "volunteer";
    } else if (user?.organizationId || user?.organizationName) {
      roleName = "organization";
    } else if (user?.partnerId || user?.companyName) {
      roleName = "partner";
    } else {
      // Default to admin if no role can be determined
      roleName = "admin";
    }

    if (!roleName) {
      return tabs; // Return only basic tab if role cannot be determined
    }

    switch (roleName?.toLowerCase()) {
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
      <TabsList className={`grid w-full ${gridCols} gap-2 p-1 h-auto mb-4 bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-purple-100/80 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg`}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-sm px-4 py-2 text-blue-700 dark:text-blue-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-200 data-[state=active]:via-indigo-200 data-[state=active]:to-purple-200 dark:data-[state=active]:from-blue-800/50 dark:data-[state=active]:via-indigo-800/50 dark:data-[state=active]:to-purple-800/50 data-[state=active]:text-blue-900 dark:data-[state=active]:text-blue-100 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-300/50 dark:data-[state=active]:border-blue-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 space-y-4 w-full bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200/30 dark:border-blue-800/30 shadow-sm"
        >
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
