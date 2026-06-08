import { LogoutButton, ThemeSwitcher, Toggle2FaForm } from "@/components";
import { auth } from "@/lib/auth";
import { Chip } from "@heroui/react";
import { LucideLogOut } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4">
      <header className="flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-2xl">
          Authentication
        </Link>
        <div className="flex gap-2">
          <ThemeSwitcher />
          <LogoutButton isIconOnly>
            <LucideLogOut />
          </LogoutButton>
        </div>
      </header>

      <section className="bg-overlay overflow-hidden rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-16">
        <div className="flex items-center gap-4">
          <div className="bg-accent size-16 flex items-center justify-center rounded-full">
            <span className="text-2xl font-semibold text-accent-foreground">
              {session.user.name[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-medium">{session.user.name}</h2>
            <p className="text-sm font-light text-muted">
              {session.user.email}
            </p>
          </div>
        </div>

        <Chip
          color={session.user.twoFactorEnabled ? "success" : "danger"}
          size="lg"
        >
          {session.user.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
        </Chip>
      </section>

      <Toggle2FaForm twoFactorEnabled={session.user.twoFactorEnabled} />
    </div>
  );
};

export default DashboardPage;
