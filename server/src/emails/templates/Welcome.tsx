
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'react-email';


interface WelcomeEmailProps {
  username: string;
}


export const WelcomeEmail = ({
  username,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-sans text-gray-900">
        <Preview>
          The sales intelligence platform that helps you uncover qualified
          leads.
        </Preview>
        <Container className="mx-auto py-5 pb-12">
          <Img
            src={`taskmanager-logo.png`}
            width="170"
            height="50"
            alt="Task Manager Logo"
            className="mx-auto"
          />
          <Text className="text-[16px] leading-6.5">
            Hi {username},
          </Text>
          <Text className="text-[16px] leading-6.5">
            Welcome to Task Manager App <strong>{username}!</strong> We're thrilled to have you on board. With Task Manager App, you can easily manage your tasks and boost your productivity. Get started by creating your first task and experience the difference!
          </Text>
          <Text className="text-[16px] leading-6.5">
            If you have any questions or need assistance, feel free to reach out to our support team. We're here to help you make the most of Task Manager App.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href="https://taskmanager-spa.vercel.app"
            >
              Get started
            </Button>
          </Section>
          <Text className="text-[16px] leading-6.5">
            Best,
            <br />
            The Task Manager App team
          </Text>
          <Hr className="border-[#cccccc] my-5" />
          <Text className="text-[#8898aa] text-[12px]">
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WelcomeEmail;
