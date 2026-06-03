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

interface VerifyEmailProps {
  fullName: string;
  verificationLink: string;
}

export default function VerificationEmail({
  fullName,
  verificationLink,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
      </Head>
      <Tailwind>
        <Body className="bg-gray-50 font-sans py-8 px-4">
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
                <Heading className="text-white text-4xl font-bold m-0 tracking-tight">
                  ✔ Verify Your Email
                </Heading>
              </Section>

              {/* Content Section */}
              <Section className="px-6 py-8">
                <Text className="text-purple-600 text-base font-semibold mb-4 capitalize">
                  Hey {fullName}! 👋
                </Text>

                <Text className="text-zinc-700 text-base leading-relaxed mb-4">
                  Welcome to Task Manager! We're excited to have you on board. To get started, please verify your email address by clicking the button below.
                </Text>

                <Text className="text-zinc-500 text-sm leading-relaxed mb-6 italic">
                  This link will expire in 5 minutes for security purposes.
                </Text>

                {/* CTA Button */}
                <Section className="text-center my-8">
                  <Button
                    href={verificationLink}
                    target="_blank"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                    }}
                    className="text-white px-6 py-2 rounded-lg font-semibold text-base no-underline cursor-pointer"
                  >
                    Verify Email Address
                  </Button>
                </Section>

                {/* Alternative Link */}
                <Hr className="border-zinc-200 my-6" />

                <Text className="text-zinc-500 text-xs leading-relaxed mt-4">
                  If the button above doesn't work, copy and paste this link into your browser:
                </Text>

                <Text className="text-purple-600 text-xs break-all mt-3 p-3 bg-purple-50 rounded font-mono border border-purple-200">
                  {verificationLink}
                </Text>
              </Section>

              {/* Footer Section */}
              <Section className="bg-zinc-50 px-6 py-5 border-t border-zinc-200 text-center">
                <Text className="text-zinc-500 text-xs mb-2 m-0">
                  © {new Date().getFullYear()} Task Manager. All rights reserved.
                </Text>
                <Text className="text-zinc-400 text-xs m-0">
                  If you didn't sign up, you can safely ignore this email.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}