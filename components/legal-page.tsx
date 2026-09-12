import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import styles from "./legal-page.module.css";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  eyebrow: string;
  intro: string;
  updated?: string;
  sections: LegalSection[];
};

export function LegalPage({
  title,
  eyebrow,
  intro,
  updated = "Septiembre de 2026",
  sections,
}: LegalPageProps) {
  return (
    <main className={styles.page}>
      <header className="shop-header">
        <Link className="wordmark" href="/">
          [ ] <span>TCG STORE</span>
        </Link>

        <nav>
          <Link href="/pokemon">Pokémon</Link>
          <Link href="/riftbound">Riftbound</Link>
          <Link href="/yugioh">Yu-Gi-Oh!</Link>
        </nav>

        <div className="header-actions">
          <AuthButton />

          <Link
            href="/admin"
            className={styles.adminButton}
          >
            Admin
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link
            href="/"
            className={styles.back}
          >
            ← Volver a la tienda
          </Link>

          <p>{eyebrow}</p>

          <h1>{title}</h1>

          <span>{intro}</span>

          <small>
            Última actualización: {updated}
          </small>
        </div>
      </section>

      <section className={styles.content}>
        {sections.map((section, index) => (
          <article
            className={styles.section}
            key={section.title}
          >
            <div className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </div>

            <div>
              <h2>{section.title}</h2>

              {section.paragraphs?.map(
                (paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>
                    {paragraph}
                  </p>
                )
              )}

              {section.bullets &&
                section.bullets.length > 0 && (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </article>
        ))}

        <aside className={styles.notice}>
          <strong>Contacto</strong>

          <p>
            Para dudas relacionadas con estas políticas,
            utiliza el correo de atención al cliente
            publicado en la tienda.
          </p>
        </aside>
      </section>

      <footer className="store-footer">
        <Link className="wordmark" href="/">
          [ ] <span>TCG STORE</span>
        </Link>

        <p>Cartas coleccionables · México</p>

        <div>
          <Link href="/politica-de-privacidad">
            Política de privacidad
          </Link>

          <Link href="/terminos-y-condiciones">
            Términos y condiciones
          </Link>

          <Link href="/politica-de-envios">
            Política de envíos
          </Link>

          <Link href="/admin">
            Administración
          </Link>
        </div>
      </footer>
    </main>
  );
}