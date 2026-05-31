import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Tailwind,
} from "react-email";

interface VerifyEmailProps {
  username: string;
  verificationLink: string;
}

export default function VerifyEmail({
  username,
  verificationLink,
}: VerifyEmailProps) {
  
  return (
    <Html>
      <Tailwind>
        <Body className="bg-gray-100 font-sans p-5">
          <Container className="bg-white rounded-lg p-8 mx-auto">
            <Heading className="text-2xl font-bold mb-4">Email Verification</Heading>

            <Text className="text-base text-gray-800 mb-4">Hello {username},</Text>

            <Text className="text-base text-gray-700 mb-6">
              Thank you for signing up. Please verify your email
              address by clicking the button below.
            </Text>

            <Button
              href={verificationLink}
              target="_blank"
              className="bg-black text-white px-5 py-3 rounded no-underline text-center inline-block font-semibold cursor-pointer"
            >
              Verify Email
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}