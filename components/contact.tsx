import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/const";

export default function Contact() {
  const t = useTranslations("Contact");

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-foreground/10 bg-foreground/5 p-6 shadow-sm text-sm text-foreground/70">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <Mail className="h-4 w-4" />
        {t("title")}
      </div>
      <div>
        <p>{t("description")}</p>
        <p>{t("screenshot")}</p>
      </div>
      <div className="font-medium text-foreground">
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
