import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Text,
  Button,
  Tailwind,
  Section,
  Hr,
} from "react-email";

interface PasswordResetEmailProps {
  fullName: string;
  resetLink: string;
}

export default function PasswordResetEmail({
  fullName,
  resetLink,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
      </Head>
      <Tailwind>
        <Body className="bg-zinc-50 font-sans py-8 px-4">
          <Container className="max-w-md mx-auto">
            {/* Header Section */}
            <Section className="bg-white rounded-xl overflow-hidden shadow">
              {/* Gradient Header */}
              <Section
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                }}
                className="px-6 py-10 text-center"
              >
                <Heading className="text-white text-3xl font-bold m-0 tracking-tight">
                  🔐 Reset Password
                </Heading>
              </Section>

              {/* Content Section */}
              <Section className="px-6 py-8">
                <Text className="text-violet-600 text-base font-semibold m-0 mb-4 capitalize">
                  Hi {fullName},
                </Text>

                <Text className="text-zinc-700 text-sm leading-6 m-0 mb-4">
                  We received a request to reset your password. Click the button below to create a new password for your account.
                </Text>

                <Text className="text-zinc-500 text-xs leading-6 m-0 mb-6 italic">
                  This link will expire in 10 minutes for security purposes.
                </Text>

                {/* CTA Button */}
                <div className="text-center my-8">
                  <Button
                    href={resetLink}
                    target="_blank"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                    }}
                    className="text-white px-8 py-3 rounded text-sm font-semibold no-underline inline-block cursor-pointer border-0"
                  >
                    Reset Password
                  </Button>
                </div>

                {/* Alternative Link */}
                <Hr className="border-0 border-t border-zinc-200 my-6" />

                <Text className="text-zinc-500 text-xs leading-6 mt-4 m-0">
                  If the button above doesn't work, copy and paste this link into your browser:
                </Text>

                <Text className="text-violet-600 text-xs break-all mt-3 p-3 bg-violet-50 rounded-md font-mono border border-violet-200 m-0">
                  {resetLink}
                </Text>
              </Section>

              {/* Footer Section */}
              <Section className="bg-zinc-100 px-6 py-5 border-t border-zinc-200 text-center">
                <Text className="text-zinc-400 text-xs m-0 mb-2">
                  © {new Date().getFullYear()} Task Manager. All rights reserved.
                </Text>
                <Text className="text-zinc-300 text-xs m-0">
                  If you didn't request a password reset, you can safely ignore this email.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
