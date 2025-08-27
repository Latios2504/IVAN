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
      <TabsList className={`grid w-full ${gridCols} gap-2 p-1 h-auto mb-4 bg-muted/30 border border-border shadow-lg rounded-xl`}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-sm px-4 py-2 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border hover:bg-muted/50 transition-all duration-200 rounded-lg"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 space-y-4 w-full bg-muted/30 p-4 rounded-2xl border border-border shadow-sm"
        >
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
