import { getAppUrl } from "@/lib/app-url";
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

export async function payoutProcessedEmailTemplate(data: {
  name: string;
  amount: number;
  cryptocurrency: string;
  status: "completed" | "canceled";
  dashboardUrl?: string;
}) {
  const isCompleted = data.status === "completed";
  const subject = isCompleted
    ? "Your payout has been processed"
    : "Your payout request has been canceled";

  let message = "";
  if (isCompleted) {
    message = `Your payout request has been processed and sent to your wallet.\n\nAmount: $${data.amount.toFixed(2)}\n\nThe funds should appear in your wallet shortly. If you have any questions, please contact support.`;
  } else {
    message = `Your payout request has been canceled.\n\nAmount: $${data.amount.toFixed(2)}\n\nIf you have any questions or would like to request a new payout, please contact support or visit your dashboard.`;
  }

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/affiliates`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "View Dashboard",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function affiliateApplicationReceivedEmailTemplate(data: {
  name: string;
  code: string;
}) {
  const subject = "Affiliate application received";
  const message = `We've received your affiliate application and are excited to review it.\n\nYour Requested Code: ${data.code}\n\nOur team will review your application and get back to you soon. We typically review applications within 1-2 business days.\n\nOnce approved, you'll be able to:\n• Earn 20% commission on every purchase made with your code\n• Track your earnings and referrals in your dashboard\n• Request payouts in cryptocurrency\n\nWe'll notify you via email once your application has been reviewed.\n\nThank you for your interest in our affiliate program!`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function affiliateApprovalEmailTemplate(data: {
  name: string;
  code: string;
  dashboardUrl?: string;
}) {
  const subject = "Your affiliate application has been approved!";
  const message = `Your affiliate application has been approved. You can now start earning commissions by sharing your unique affiliate code.\n\nYour Affiliate Code: ${data.code}\n\nShare this code with your audience and earn 20% commission on every purchase made using your code.\n\nYou can view your affiliate dashboard, track your earnings, and request payouts at any time.`;

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/affiliates`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "View Dashboard",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function affiliateRejectionEmailTemplate(data: {
  name: string;
  reason: string;
}) {
  const subject = "Affiliate application update";
  const message = `Thank you for your interest in our affiliate program. Unfortunately, we are unable to approve your application at this time.\n\nReason: ${data.reason}\n\nIf you have any questions or would like to reapply in the future, please don't hesitate to contact us.\n\nThank you for your interest.`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function affiliateApplicationAdminNotificationTemplate(data: {
  applicantName: string;
  applicantEmail: string;
  code: string;
  message?: string | null;
  socialMedia?: string | null;
  dashboardUrl?: string;
}) {
  const subject = "New affiliate application received";
  let message = `A new affiliate application has been submitted.\n\nApplicant: ${data.applicantName} (${data.applicantEmail})\nRequested Code: ${data.code}`;

  if (data.message) {
    message += `\n\nMessage: ${data.message}`;
  }

  if (data.socialMedia) {
    message += `\n\nSocial Media: ${data.socialMedia}`;
  }

  message += `\n\nPlease review and approve or reject this application.`;

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/admin/affiliates`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: "Admin",
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "Review Application",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function payoutRequestCreatedEmailTemplate(data: {
  name: string;
  amount: number;
  dashboardUrl?: string;
}) {
  const subject = "Payout request submitted";
  const message = `Your payout request has been submitted successfully.\n\nAmount: $${data.amount.toFixed(2)}\n\nWe'll review your request and process it as soon as possible. You'll receive an email notification once your payout has been processed.`;

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/affiliates/payouts`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "View Payout Requests",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function payoutRequestAdminNotificationTemplate(data: {
  affiliateName: string;
  affiliateEmail: string;
  affiliateCode: string;
  amount: number;
  cryptocurrency: string;
  network: string;
  walletAddress: string;
  dashboardUrl?: string;
}) {
  const subject = "New payout request received";
  const message = `A new payout request has been submitted.\n\nAffiliate: ${data.affiliateName} (${data.affiliateEmail})\nAffiliate Code: ${data.affiliateCode}\n\nAmount: $${data.amount.toFixed(2)}\nCryptocurrency: ${data.cryptocurrency.toUpperCase()}\nNetwork: ${data.network}\nWallet Address: ${data.walletAddress}\n\nPlease review and process this payout request.`;

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/admin/affiliates/payouts`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: "Admin",
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "Review Payout Request",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function affiliateNewReferralEmailTemplate(data: {
  name: string;
  code: string;
  planName?: string | null;
  dashboardUrl?: string;
}) {
  const subject = "New referral purchase with your affiliate code!";
  let message = `Great news! Someone just made a purchase using your affiliate code: ${data.code}\n\n`;

  if (data.planName) {
    message += `Plan: ${data.planName}\n`;
  }

  message += `\nYour commission will be processed once the payment is confirmed. You'll receive another email when the commission is added to your balance.`;

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/affiliates`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "View Dashboard",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function affiliateCommissionCreatedEmailTemplate(data: {
  name: string;
  commission: number;
  totalAmount: number;
  planName?: string | null;
  dashboardUrl?: string;
}) {
  const subject = "New commission earned";
  let message = `Congratulations! You've earned a new commission.\n\nCommission: $${data.commission.toFixed(2)}\nPurchase Amount: $${data.totalAmount.toFixed(2)}`;

  if (data.planName) {
    message += `\nPlan: ${data.planName}`;
  }

  message += `\n\nThis commission has been added to your balance and is available for payout.`;

  const dashboardUrl =
    data.dashboardUrl ||
    `${getAppUrl()}/dashboard/affiliates`;

  const template = await loadTemplate("base");
  const html = replaceTemplateVariables(template, {
    subject,
    name: data.name,
    message: message.replace(/\n/g, "<br>"),
    buttonUrl: dashboardUrl,
    buttonText: "View Dashboard",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

