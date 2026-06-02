"use client";

import { logout } from "@/actions";
import { Button, toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { LucideLoader } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps extends React.PropsWithChildren {
  isIconOnly?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  children,
  isIconOnly,
}) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      if (data.success) {
        router.replace("/login");
      } else {
        toast.danger("Logout failed");
      }
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      isDisabled={isPending}
      isIconOnly={isIconOnly}
      variant="danger-soft"
    >
      {isPending ? <LucideLoader className="size-4 animate-spin" /> : children}
    </Button>
  );
};
