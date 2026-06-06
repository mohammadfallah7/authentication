"use client";

import { toggle2FA } from "@/actions";
import { toggle2FASchema } from "@/types";
import {
  Button,
  Disclosure,
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
import { FC, useState } from "react";
import z from "zod";

interface Toggle2FaFormProps {
  twoFactorEnabled?: boolean | null;
}

export const Toggle2FaForm: FC<Toggle2FaFormProps> = ({ twoFactorEnabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: toggle2FA,
    onSuccess: (data) => {
      if (data.success) {
        if (twoFactorEnabled) {
          toast.success("2FA Disabled");
        } else {
          toast.success("2FA Enabled");
        }

        setIsExpanded(false);
        router.refresh();
      } else {
        toast.danger(data.error);
      }
    },
    onError: (error) => {
      toast.danger("Oops", { description: error.message });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fields = toggle2FASchema.safeParse(Object.fromEntries(formData));
    if (!fields.success) {
      return toast.danger("Missing fields", {
        description: z.treeifyError(fields.error).properties?.password?.errors,
      });
    }

    mutate(fields.data);
  }

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="w-full max-w-lg text-center">
        <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
          <Disclosure.Heading>
            <Button slot="trigger" variant="secondary">
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              <Disclosure.Indicator />
            </Button>
          </Disclosure.Heading>
          <Disclosure.Content>
            <Disclosure.Body className="shadow-panel flex rounded-3xl bg-surface p-4">
              <Form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full"
              >
                <TextField
                  isRequired
                  name="password"
                  type="password"
                  className="items-start"
                >
                  <Label>Password</Label>
                  <Input
                    placeholder="••••••••"
                    variant="secondary"
                    className="w-full"
                  />
                  <FieldError />
                </TextField>

                <Button isDisabled={isPending} className="w-full" type="submit">
                  {isPending && (
                    <LucideLoader className="size-4 animate-spin" />
                  )}
                  {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </Form>
            </Disclosure.Body>
          </Disclosure.Content>
        </Disclosure>
      </div>
    </div>
  );
};
