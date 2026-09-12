import {
  SiteHeader,
} from "@/components/site-header";

import {
  SiteFooter,
} from "@/components/site-footer";

import styles from "./legal-page.module.css";

export type LegalSection = {
  title: string;

  paragraphs?:
    string[];

  bullets?:
    string[];
};

type LegalPageProps = {
  title: string;

  eyebrow: string;

  intro: string;

  updated?: string;

  sections:
    LegalSection[];
};

export function LegalPage({
  title,
  eyebrow,
  intro,
  updated =
    "Septiembre de 2026",
  sections,
}: LegalPageProps) {
  return (
    <main
      className={
        styles.page
      }
    >
      <SiteHeader
        variant="light"
      />

      <section
        className={
          styles.hero
        }
      >
        <div
          className={
            styles.heroInner
          }
        >
          <p>
            {eyebrow}
          </p>

          <h1>
            {title}
          </h1>

          <span>
            {intro}
          </span>

          <small>
            Última
            actualización:{" "}
            {updated}
          </small>
        </div>
      </section>

      <section
        className={
          styles.content
        }
      >
        {sections.map(
          (
            section,
            index
          ) => (
            <article
              className={
                styles.section
              }
              key={
                section.title
              }
            >
              <div
                className={
                  styles.number
                }
              >
                {String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </div>

              <div>
                <h2>
                  {
                    section.title
                  }
                </h2>

                {section.paragraphs?.map(
                  (
                    paragraph,
                    paragraphIndex
                  ) => (
                    <p
                      key={
                        paragraphIndex
                      }
                    >
                      {
                        paragraph
                      }
                    </p>
                  )
                )}

                {section.bullets &&
                  section
                    .bullets
                    .length >
                    0 && (
                    <ul>
                      {section.bullets.map(
                        (
                          item
                        ) => (
                          <li
                            key={
                              item
                            }
                          >
                            {
                              item
                            }
                          </li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            </article>
          )
        )}

        <aside
          className={
            styles.notice
          }
        >
          <strong>
            Contacto
          </strong>

          <p>
            Para dudas
            relacionadas con
            estas políticas,
            utiliza el correo
            de atención al
            cliente publicado
            en Pokeamigos.
          </p>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}