import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AuthenticationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await auth.api.getSession({ headers: await headers() });
  if (user) redirect("/dashboard");

  return (
    <div className="flex items-center justify-center min-h-screen px-6 md:px-4">
      {children}
    </div>
  );
};

export default AuthenticationLayout;
