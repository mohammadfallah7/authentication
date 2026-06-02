import { LogoutButton, ThemeSwitcher } from "@/components";
import { auth } from "@/lib/auth";
import { LucideLogOut } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await auth.api.getSession({ headers: await headers() });
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between py-3">
        <h1 className="font-bold text-2xl">Authentication</h1>
        <div className="flex gap-2">
          <ThemeSwitcher />
          <LogoutButton isIconOnly>
            <LucideLogOut />
          </LogoutButton>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
