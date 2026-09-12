import Link from "next/link";

import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer
      className={
        styles.footer
      }
    >
      <Link
        className={
          styles.brand
        }
        href="/"
      >
        <span>
          [ ]
        </span>

        <strong>
          POKEAMIGOS
        </strong>
      </Link>

      <p>
        Cartas coleccionables
        · México
      </p>

      <nav>
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
      </nav>
    </footer>
  );
}