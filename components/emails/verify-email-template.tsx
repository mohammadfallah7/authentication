import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface VerifyEmailTemplate {
  name: string;
  email: string;
  verificationUrl: string;
}

export const VerifyEmailTemplate = (props: VerifyEmailTemplate) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans p-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[24px] font-bold text-gray-900 m-0">
                Verify Your Email Address
              </Text>
              <Text className="text-[16px] text-gray-600 mt-[8px] m-0">
                Please confirm your email to complete your registration
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                Hello {props.name},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                Thank you for signing up! To complete your registration and
                secure your account, please verify your email address by
                clicking the button below.
              </Text>

              {/* Verification Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={props.verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                If the button above doesn&apos;t work, you can copy and paste
                the following link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all mb-[24px]">
                {props.verificationUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                This verification link will expire in 1 hour for security
                purposes.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Security Notice */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                <strong>Security Notice:</strong> If you didn&apos;t create an
                account with us, you can safely ignore this email. Your email
                address will not be added to our system.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px]">
                This email was sent to {props.email}
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © 2024 Authentication. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
