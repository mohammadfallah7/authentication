import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";

interface SendOTPTemplateProps {
  otpCode: string;
  userEmail: string;
}

export const SendOTPTemplate = (props: SendOTPTemplateProps) => {
  const { otpCode, userEmail } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your verification code: {otpCode}</Preview>
        <Body className="bg-gray-100 font-sans p-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto px-[48px] py-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
                Two-Factor Authentication
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Verification Code Required
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-800 leading-[24px] m-0 mb-[16px]">
                Hello,
              </Text>
              <Text className="text-[16px] text-gray-800 leading-[24px] m-0 mb-[24px]">
                A sign-in attempt requires additional verification because we
                didn&apos;t recognize your device. To complete the sign-in,
                enter the verification code on the unrecognized device.
              </Text>

              {/* OTP Code Display */}
              <Section className="text-center bg-gray-50 rounded-[8px] py-[24px] px-[32px] mb-[24px]">
                <Text className="text-[14px] text-gray-600 m-0 mb-[8px] uppercase tracking-wide">
                  Verification Code
                </Text>
                <Text className="text-[32px] font-bold text-gray-900 m-0 letter-spacing-[8px] font-mono">
                  {otpCode}
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-800 leading-[24px] m-0 mb-[16px]">
                This code will expire in <strong>3 minutes</strong> for your
                security.
              </Text>

              <Text className="text-[16px] text-gray-800 leading-[24px] m-0 mb-[24px]">
                If you didn&apos;t attempt to sign in, please ignore this email
                or contact our support team if you have concerns about your
                account security.
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-blue-50 border-l-4 border-solid border-blue-400 pl-[16px] py-[16px] mb-[32px]">
              <Text className="text-[14px] text-blue-800 m-0 mb-[8px] font-semibold">
                Security Notice
              </Text>
              <Text className="text-[14px] text-blue-700 leading-[20px] m-0">
                Never share this verification code with anyone. Our team will
                never ask for your verification code.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[14px] text-gray-500 leading-[20px] m-0 mb-[8px]">
                This email was sent to {userEmail}
              </Text>
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0 mb-[16px]">
                © {new Date().getFullYear()} Authentication. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
