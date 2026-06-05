import { ResetPasswordForm } from "@/components";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const token = (await searchParams).token;

  return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
