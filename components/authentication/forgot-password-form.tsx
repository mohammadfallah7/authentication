"use client";

import { forgotPassword } from "@/actions";
import { forgotPasswordSchema } from "@/types";
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
import { linkVariants } from "@heroui/styles";
import { useMutation } from "@tanstack/react-query";
import { LucideCheck, LucideLoader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const ForgotPasswordForm = () => {
  const [emailSent, setEmailSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onMutate: () => {
      const loadingId = toast("Sending email...", {
        description: "Please wait while we sending you an email",
        isLoading: true,
        timeout: 0,
      });

      return { loadingId };
    },
    onSuccess: (data, _, onMutateResult) => {
      toast.close(onMutateResult.loadingId);

      if (data.success) {
        toast.success("Email successfully sent", {
          description: data.response?.message,
        });
        setEmailSent(true);
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

    const formData = new FormData(e.currentTarget);
    const fields = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
    if (!fields.success) {
      return toast.danger("Missing fields");
    }

    mutate(fields.data);
  }

  const slots = linkVariants();

  return (
    <Card className="w-full max-w-md">
      <Card.Header className="space-y-1.5">
        <Card.Title className="text-xl">Forgot Password</Card.Title>
        <Card.Description>
          Enter your email address to receive reset password link
        </Card.Description>
      </Card.Header>
      {emailSent ? (
        <Card.Content className="bg-success/80 rounded-lg flex flex-col items-center justify-center p-3">
          <LucideCheck className="size-8" />
          <h3 className="font-medium text-lg">Email successfully sent</h3>
          <p className="text-sm">Reset password link successfully sent</p>
        </Card.Content>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Card.Content>
            <div className="flex flex-col gap-4">
              <TextField isRequired name="email" type="email">
                <Label>Email</Label>
                <Input placeholder="email@example.com" variant="secondary" />
                <FieldError />
              </TextField>
            </div>
          </Card.Content>
          <Card.Footer className="mt-4 flex flex-col gap-3">
            <Button isDisabled={isPending} className="w-full" type="submit">
              {isPending && <LucideLoader className="size-4 animate-spin" />}
              Send Link
            </Button>
            <div className="flex items-center justify-center gap-1 flex-col md:flex-row">
              <span className="text-sm">Remember your password?</span>
              <Link className={slots.base()} href="/login">
                Login
              </Link>
            </div>
          </Card.Footer>
        </Form>
      )}
    </Card>
  );
};
