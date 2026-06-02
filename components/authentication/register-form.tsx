"use client";

import { register } from "@/actions";
import { registerSchema } from "@/types";
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

export function RegisterForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onMutate: () => {
      const loadingId = toast("Creating account...", {
        description: "Please wait while we create your account",
        isLoading: true,
        timeout: 0,
      });

      return { loadingId };
    },
    onSuccess: (data, _, onMutateResult) => {
      toast.close(onMutateResult.loadingId);
      toast.success("Register successful", {
        description: `Welcome dear, ${data.response?.user.name}`,
      });

      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.danger("Oops", {
        description: error.message,
      });
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fields = registerSchema.safeParse(Object.fromEntries(formData));
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
          <Card.Title className="text-xl">Register</Card.Title>
          <Card.Description>
            Enter your credentials to create new account
          </Card.Description>
        </Card.Header>
        <Form onSubmit={handleSubmit}>
          <Card.Content className="space-y-1.5">
            <div className="flex flex-col gap-4">
              <TextField isRequired name="name" type="text">
                <Label>Name</Label>
                <Input placeholder="John Doe" variant="secondary" />
                <FieldError />
              </TextField>

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
          </Card.Content>
          <Card.Footer className="mt-4 flex flex-col gap-3">
            <Button isDisabled={isPending} className="w-full" type="submit">
              {isPending && <LucideLoader className="size-4 animate-spin" />}
              Sign Up
            </Button>
            <div className="flex items-center justify-center gap-1 flex-col md:flex-row">
              <span className="text-sm">Already have an account?</span>
              <Link className={slots.base()} href="/login">
                Login
              </Link>
            </div>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
