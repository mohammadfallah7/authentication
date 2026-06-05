"use client";

import { resetPassword } from "@/actions";
import { resetPasswordSchema } from "@/types";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { LucideLoader } from "lucide-react";
import { useRouter } from "next/navigation";
import z from "zod";

interface ResetPasswordFormProps {
  token?: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
}) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Password successfully reset");
        router.replace("/login");
      } else {
        toast.danger("Reset password failed", {
          description: data.error,
        });
      }
    },
    onError: (error) => {
      toast.danger("Oops", {
        description: error.message,
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) {
      return toast.danger("Missing token");
    }

    const formData = new FormData(e.currentTarget);
    const fields = resetPasswordSchema.safeParse(Object.fromEntries(formData));
    if (!fields.success) {
      return toast.danger("Missing fields", {
        description: z.treeifyError(fields.error).properties?.newPassword
          ?.errors,
      });
    }

    mutate({ ...fields.data, token });
  }

  return (
    <Card className="w-full max-w-md">
      <Card.Header className="space-y-1.5">
        <Card.Title className="text-xl">Reset Password</Card.Title>
        <Card.Description>
          Choose new password for your account
        </Card.Description>
      </Card.Header>
      <Form onSubmit={handleSubmit}>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField isRequired name="newPassword" type="password">
              <Label>New Password</Label>
              <Input placeholder="••••••••" variant="secondary" />
              <FieldError />
            </TextField>
            <TextField isRequired name="repeatPassword" type="password">
              <Label>Repeat Password</Label>
              <Input placeholder="••••••••" variant="secondary" />
              <FieldError />
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-4">
          <Button isDisabled={isPending} className="w-full" type="submit">
            {isPending && <LucideLoader className="size-4 animate-spin" />}
            Reset Password
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  );
};
