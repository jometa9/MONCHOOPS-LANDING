import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getCurrentUserFromSession } from "@/lib/db/queries";
import { readFileSync } from "fs";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { join } from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DocumentationPage() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect("/sign-in");
  }

  const t = await getTranslations("dashboard");
  let markdownContent = "";
  try {
    const filePath = join(process.cwd(), "public", "docs.md");
    markdownContent = readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading docs.md:", error);
    markdownContent = `# ${t("documentationTitle")}\n\nThe \`docs.md\` file was not found.`;
  }

  return (
    <div className="px-3 w-full max-w-4xl">
      <div className="w-full  pb-20">
        <h1 className="text-2xl">{t("documentationTitle")}</h1>
        <p className=" text-gray-600 text-sm max-w-2xl pt-1">
          {t("documentationSubtitle")}
        </p>
        <MarkdownRenderer content={markdownContent} />
      </div>
    </div>
  );
}
