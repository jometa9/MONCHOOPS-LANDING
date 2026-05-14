import { marked } from "marked";
import { loadTemplate, replaceTemplateVariables } from "./template-loader";

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function markdownToHtml(markdown: string): string {
  try {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const result = marked.parse(markdown);
    return typeof result === "string" ? result : result.toString();
  } catch {
    return `<pre>${markdown}</pre>`;
  }
}

export async function broadcastEmailTemplate(data: {
  name: string;
  subject: string;
  message: string;
  isImportant?: boolean;
}) {
  const template = await loadTemplate("base");
  const messageText = data.message;
  const html = replaceTemplateVariables(template, {
    subject: data.subject,
    name: data.name,
    message: messageText,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function richContentEmailTemplate(data: {
  name: string;
  subject: string;
  markdownContent: string;
}) {
  try {
    const template = await loadTemplate("base");
    const richContent = markdownToHtml(data.markdownContent);
    const html = replaceTemplateVariables(template, {
      subject: data.subject,
      name: data.name,
      richContent,
      year: new Date().getFullYear(),
    });

    return {
      html,
      text: stripHtml(html),
    };
  } catch (error) {
    throw error;
  }
}
