import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const user = await auth.api.getSession({ headers: await headers() });

  if (!user) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
};

export default HomePage;
