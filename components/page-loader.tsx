import styles from "./page-loader.module.css";

type PageLoaderProps = {
  label?: string;
  fullscreen?: boolean;
};

export function PageLoader({
  label = "Cargando Pokeamigos",
  fullscreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={`${styles.loader} ${
        fullscreen
          ? styles.fullscreen
          : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.content}>
        <div
          className={styles.cards}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <div className={styles.brand}>
          <span>[ ]</span>

          <strong>
            POKEAMIGOS
          </strong>
        </div>

        <p>{label}</p>

        <div
          className={styles.progress}
          aria-hidden="true"
        >
          <i />
        </div>
      </div>
    </div>
  );
}