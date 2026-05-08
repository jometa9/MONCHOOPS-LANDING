import { sendEmail } from "./config";
import {
  broadcastEmailTemplate,
  richContentEmailTemplate,
} from "./templates";

async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500,
  name = "Operation"
): Promise<T> {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 1.5, name);
  }
}

export async function sendBroadcastEmail({
  email,
  name,
  subject,
  message,
  isImportant = false,
}: {
  email: string;
  name: string;
  subject: string;
  message: string;
  isImportant?: boolean;
}) {
  const { html, text } = await broadcastEmailTemplate({
    name,
    subject,
    message,
    isImportant,
  });

  return sendEmail({
    to: email,
    subject: subject,
    html,
    text,
  });
}

export async function sendRichContentEmail({
  email,
  name,
  subject,
  markdownContent,
}: {
  email: string;
  name: string;
  subject: string;
  markdownContent: string;
}) {
  try {
    const { html, text } = await richContentEmailTemplate({
      name,
      subject,
      markdownContent,
    });

    const result = await withRetry(
      () => {
        return sendEmail({
          to: email,
          subject,
          html,
          text,
        });
      },
      3,
      500,
      `Rich content email to ${email}`
    );

    return result;
  } catch (error) {
    throw error;
  }
}
