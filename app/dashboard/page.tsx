import { LogoutButton } from "@/components";
import { LucideLogOut } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between py-3">
        <h1 className="font-bold text-2xl">Authentication</h1>
        <LogoutButton isIconOnly>
          <LucideLogOut />
        </LogoutButton>
      </div>
    </div>
  );
};

export default DashboardPage;
