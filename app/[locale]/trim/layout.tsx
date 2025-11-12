import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { routing, type Locale } from "@/i18n/routing";

type TrimLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function TrimLayout({
  children,
  params,
}: TrimLayoutProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale ?? routing.defaultLocale) as Locale;
  const t = await getTranslations({ locale, namespace: "Home" });
  const benefits = [
    {
      title: t("benefits.browser.title"),
      description: t("benefits.browser.description"),
    },
    {
      title: t("benefits.security.title"),
      description: t("benefits.security.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="trim-tool" className="pb-16 px-6 py-10">
        {children}
      </main>
      <section className="border-b border-foreground/5 bg-background px-6 py-10">
        <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-xl border border-foreground/10 bg-foreground/5 p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{benefit.title}</h2>
              <p className="mt-2 text-sm text-foreground/70 whitespace-pre-line">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
