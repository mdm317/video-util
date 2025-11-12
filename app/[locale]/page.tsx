import { getTranslations } from "next-intl/server";
import Link from "next-intl/link";

export default async function Home() {
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col gap-6 p-6">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-base text-muted-foreground">{t("description")}</p>
      </section>
      <Link
        href="/trim"
        className="inline-flex w-fit items-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
