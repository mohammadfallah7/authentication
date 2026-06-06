"use client";

import { login, verifyOTP } from "@/actions";
import { loginSchema } from "@/types";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  InputOTP,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { linkVariants } from "@heroui/styles";
import { useMutation } from "@tanstack/react-query";
import { LucideArrowLeft, LucideLoader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [otpState, setOtpState] = useState<{ cookie: string } | null>(null);
  const [code, setCode] = useState("");

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

      if (!data.success) {
        return toast.danger("Login failed", {
          description: data.error,
        });
      }

      if (data.twoFactorRedirect) {
        setOtpState({ cookie: data.cookieHeader });
        return;
      }

      toast.success("Welcome back", {
        description: `${data.response?.user.name}`,
      });
      router.replace("/dashboard");
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

  const { mutate: verifyOTPMutate, isPending: isVerifyPending } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (!data.success) {
        return toast.danger("Verification failed", { description: data.error });
      }

      toast.success("Verified!");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.danger("Oops", { description: error.message });
    },
  });

  function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    verifyOTPMutate({ code, cookieHeader: otpState?.cookie });
  }

  const slots = linkVariants();

  if (otpState) {
    return (
      <Card className="w-full max-w-md">
        <Card.Header className="space-y-1.5">
          <Card.Title className="text-xl">Check your email</Card.Title>
          <Card.Description>
            We sent a verification code to your email address
          </Card.Description>
        </Card.Header>
        <Form onSubmit={handleVerify}>
          <Card.Content className="items-center">
            <InputOTP
              variant="secondary"
              maxLength={6}
              value={code}
              onChange={(val) => {
                setCode(val);
              }}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
          </Card.Content>
          <Card.Footer className="mt-4 flex flex-col gap-3">
            <Button
              isDisabled={isVerifyPending}
              className="w-full"
              type="submit"
            >
              {isVerifyPending && (
                <LucideLoader className="size-4 animate-spin" />
              )}
              Verify
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onPress={() => {
                setOtpState(null);
                setCode("");
              }}
            >
              <LucideArrowLeft className="size-4" /> Back to Login
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    );
  }

  return (
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
  );
}
