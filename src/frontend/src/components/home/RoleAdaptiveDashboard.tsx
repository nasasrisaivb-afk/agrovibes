import type { UserRole } from "../../context/RoleContext";
import { BuyerDashboard } from "./BuyerDashboard";
import { EducatorDashboard } from "./EducatorDashboard";
import { FarmerDashboard } from "./FarmerDashboard";
import { MachineryDashboard } from "./MachineryDashboard";
import { ServiceDashboard } from "./ServiceDashboard";

interface RoleAdaptiveDashboardProps {
  role: UserRole;
}

export function RoleAdaptiveDashboard({ role }: RoleAdaptiveDashboardProps) {
  switch (role) {
    case "farmer":
      return <FarmerDashboard />;
    case "buyer":
      return <BuyerDashboard />;
    case "educator":
      return <EducatorDashboard />;
    case "machinery":
      return <MachineryDashboard />;
    case "service":
      return <ServiceDashboard />;
    default:
      return <FarmerDashboard />;
  }
}
