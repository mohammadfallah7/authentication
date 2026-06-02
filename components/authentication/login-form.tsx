"use client";

import { login } from "@/actions";
import { loginSchema } from "@/types";
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
import { LucideLoader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onMutate: () => {
      const loadingId = toast("Login to account...", {
        description: "Please wait while logging you in",
        isLoading: true,
        timeout: 0,
      });

      return { loadingId };
    },
    onSuccess: (data, _, onMutateResult) => {
      toast.close(onMutateResult.loadingId);

      if (data.success) {
        toast.success("Login successful", {
          description: `Welcome back dear, ${data.response?.user.name}`,
        });
        router.replace("/dashboard");
      } else {
        toast.danger("Login failed", {
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

    const fields = loginSchema.safeParse(Object.fromEntries(formData));
    if (!fields.success) {
      return toast.danger("Missing fields");
    }

    mutate(fields.data);
  }

  const slots = linkVariants();

  return (
    <div className="flex items-center justify-center min-h-screen px-6 md:px-4">
      <Card className="w-full max-w-md">
        <Card.Header className="space-y-1.5">
          <Card.Title className="text-xl">Login</Card.Title>
          <Card.Description>
            Enter your credentials to access your account
          </Card.Description>
        </Card.Header>
        <Form onSubmit={handleSubmit}>
          <Card.Content className="space-y-1.5">
            <div className="flex flex-col gap-4">
              <TextField isRequired name="email" type="email">
                <Label>Email</Label>
                <Input placeholder="email@example.com" variant="secondary" />
                <FieldError />
              </TextField>
              <TextField isRequired name="password" type="password">
                <Label>Password</Label>
                <Input placeholder="••••••••" variant="secondary" />
                <FieldError />
              </TextField>
            </div>
            <div className="flex justify-end">
              <Link className={slots.base()} href="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </Card.Content>
          <Card.Footer className="mt-4 flex flex-col gap-3">
            <Button isDisabled={isPending} className="w-full" type="submit">
              {isPending && <LucideLoader className="size-4 animate-spin" />}
              Sign In
            </Button>
            <div className="flex items-center justify-center gap-1 flex-col md:flex-row">
              <span className="text-sm">You have no account?</span>
              <Link className={slots.base()} href="/register">
                Register
              </Link>
            </div>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
