import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import React from "react";

interface InviteEmailProps {
  organizationName: string;
  inviteUrl: string;
}

export const InviteEmail: React.FC<InviteEmailProps> = ({
  organizationName = "GAIK Dashboard",
  inviteUrl = "http://localhost:3000/signup?token=123",
}) => (
  <Html>
    <Head />
    <Preview>You have been invited to join {organizationName}</Preview>
    <Body style={main}>
      <Container>
        <Heading>Welcome to {organizationName}!</Heading>
        <Text>
          You have been invited to join the {organizationName} platform. Click
          the button below to accept the invitation and create your account.
        </Text>
        <Button href={inviteUrl} style={button}>
          Accept Invitation
        </Button>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  padding: "40px 0",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const button = {
  backgroundColor: "#5046e6",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px auto",
};

export default InviteEmail;
