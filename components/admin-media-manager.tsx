"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MediaTarget =
  | "home"
  | "catalog"
  | "logo";

type MediaInfo = {
  path: string;
  url: string;
};

type MediaMap = Record<
  string,
  MediaInfo
>;

type Props = {
  save: (message: string) => void;
};

const games = [
  {
    slug: "pokemon",
    name: "Pokémon",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
  },
  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
  },
];

const tableByTarget: Record<
  MediaTarget,
  string
> = {
  home: "home_covers",
  catalog: "catalog_covers",
  logo: "tcg_logos",
};

const folderByTarget: Record<
  MediaTarget,
  string
> = {
  home: "home",
  catalog: "catalog",
  logo: "logos",
};

export function AdminMediaManager({
  save,
}: Props) {
  const [
    homeCovers,
    setHomeCovers,
  ] = useState<MediaMap>({});

  const [
    catalogCovers,
    setCatalogCovers,
  ] = useState<MediaMap>({});

  const [
    logos,
    setLogos,
  ] = useState<MediaMap>({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const buildMap = (
      rows:
        | {
            tcg: string;
            storage_path: string;
          }[]
        | null
    ) => {
      const result: MediaMap =
        {};

      for (const row of rows ?? []) {
        const {
          data,
        } = client.storage
          .from("catalog-images")
          .getPublicUrl(
            row.storage_path
          );

        result[row.tcg] = {
          path:
            row.storage_path,
          url:
            data.publicUrl,
        };
      }

      return result;
    };

    const loadMedia =
      async () => {
        const [
          homeResult,
          catalogResult,
          logoResult,
        ] =
          await Promise.all([
            client
              .from(
                "home_covers"
              )
              .select(
                "tcg,storage_path"
              ),

            client
              .from(
                "catalog_covers"
              )
              .select(
                "tcg,storage_path"
              ),

            client
              .from(
                "tcg_logos"
              )
              .select(
                "tcg,storage_path"
              ),
          ]);

        if (homeResult.error) {
          console.error(
            "Error cargando portadas de inicio:",
            homeResult.error
          );
        }

        if (
          catalogResult.error
        ) {
          console.error(
            "Error cargando portadas internas:",
            catalogResult.error
          );
        }

        if (logoResult.error) {
          console.error(
            "Error cargando logos:",
            logoResult.error
          );
        }

        setHomeCovers(
          buildMap(
            homeResult.data
          )
        );

        setCatalogCovers(
          buildMap(
            catalogResult.data
          )
        );

        setLogos(
          buildMap(
            logoResult.data
          )
        );

        setLoading(false);
      };

    loadMedia();
  }, []);

  const getMap = (
    target: MediaTarget
  ) => {
    if (target === "home") {
      return homeCovers;
    }

    if (
      target === "catalog"
    ) {
      return catalogCovers;
    }

    return logos;
  };

  const updateMap = (
    target: MediaTarget,
    slug: string,
    value?: MediaInfo
  ) => {
    const updater = (
      current: MediaMap
    ) => {
      const next = {
        ...current,
      };

      if (value) {
        next[slug] = value;
      } else {
        delete next[slug];
      }

      return next;
    };

    if (target === "home") {
      setHomeCovers(updater);
      return;
    }

    if (
      target === "catalog"
    ) {
      setCatalogCovers(
        updater
      );

      return;
    }

    setLogos(updater);
  };

  const uploadMedia =
    async (
      target: MediaTarget,
      slug: string,
      name: string,
      file?: File
    ) => {
      if (
        !supabase ||
        !file
      ) {
        return;
      }

      const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowed.includes(
          file.type
        )
      ) {
        save(
          "Utiliza una imagen JPG, PNG o WebP."
        );

        return;
      }

      if (
        file.size >
        6 *
          1024 *
          1024
      ) {
        save(
          "La imagen no puede superar los 6 MB."
        );

        return;
      }

      const client =
        supabase;

      const id =
        `${target}-${slug}`;

      setUploading(id);

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            ""
          ) || "png";

      const folder =
        folderByTarget[
          target
        ];

      const path =
        `${folder}/${slug}-${Date.now()}.${extension}`;

      const oldMedia =
        getMap(target)[slug];

      try {
        const {
          error:
            uploadError,
        } =
          await client.storage
            .from(
              "catalog-images"
            )
            .upload(
              path,
              file,
              {
                cacheControl:
                  "3600",
                upsert: false,
                contentType:
                  file.type,
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        const table =
          tableByTarget[
            target
          ];

        const {
          error: dbError,
        } =
          await client
            .from(table)
            .upsert(
              {
                tcg: slug,
                storage_path:
                  path,
                alt_text:
                  target ===
                  "logo"
                    ? `Logo ${name}`
                    : `Portada ${name}`,
                updated_at:
                  new Date()
                    .toISOString(),
              },
              {
                onConflict:
                  "tcg",
              }
            );

        if (dbError) {
          await client.storage
            .from(
              "catalog-images"
            )
            .remove([
              path,
            ]);

          throw dbError;
        }

        if (
          oldMedia?.path &&
          oldMedia.path !==
            path
        ) {
          await client.storage
            .from(
              "catalog-images"
            )
            .remove([
              oldMedia.path,
            ]);
        }

        const {
          data: publicData,
        } =
          client.storage
            .from(
              "catalog-images"
            )
            .getPublicUrl(
              path
            );

        updateMap(
          target,
          slug,
          {
            path,
            url:
              publicData.publicUrl,
          }
        );

        if (
          target === "logo"
        ) {
          save(
            `Logo de ${name} actualizado`
          );
        } else if (
          target === "home"
        ) {
          save(
            `Portada de inicio de ${name} actualizada`
          );
        } else {
          save(
            `Portada interna de ${name} actualizada`
          );
        }
      } catch (error) {
        console.error(
          "Error guardando imagen:",
          error
        );

        save(
          "No se pudo guardar la imagen."
        );
      } finally {
        setUploading("");
      }
    };

  const removeMedia =
    async (
      target: MediaTarget,
      slug: string
    ) => {
      if (!supabase) {
        return;
      }

      const client =
        supabase;

      const media =
        getMap(target)[slug];

      const table =
        tableByTarget[
          target
        ];

      const {
        error,
      } = await client
        .from(table)
        .delete()
        .eq("tcg", slug);

      if (error) {
        console.error(error);

        save(
          "No se pudo eliminar."
        );

        return;
      }

      if (media?.path) {
        await client.storage
          .from(
            "catalog-images"
          )
          .remove([
            media.path,
          ]);
      }

      updateMap(
        target,
        slug
      );

      save(
        "Imagen eliminada"
      );
    };

  const renderCards = (
    target: MediaTarget,
    data: MediaMap
  ) => {
    const logoMode =
      target === "logo";

    return (
      <div className="cover-grid">
        {games.map(
          (game) => {
            const media =
              data[
                game.slug
              ];

            const currentId =
              `${target}-${game.slug}`;

            const busy =
              uploading ===
              currentId;

            return (
              <article
                className="cover-card"
                key={
                  currentId
                }
              >
                <div
                  className={`cover-preview ${
                    media
                      ? "has-image"
                      : ""
                  }`}
                  style={{
                    backgroundImage:
                      media
                        ? `url("${media.url}")`
                        : undefined,

                    backgroundSize:
                      logoMode
                        ? "contain"
                        : "cover",

                    backgroundRepeat:
                      "no-repeat",

                    backgroundPosition:
                      "center",

                    backgroundColor:
                      logoMode
                        ? "#0b1020"
                        : undefined,
                  }}
                >
                  {!media && (
                    <span>
                      {logoMode
                        ? `Logo ${game.name}`
                        : game.name}
                    </span>
                  )}
                </div>

                <div>
                  <h3>
                    {game.name}
                  </h3>

                  <p>
                    {target ===
                    "home"
                      ? "Imagen de la tarjeta en la página principal."
                      : target ===
                          "catalog"
                        ? "Portada que aparece dentro del catálogo."
                        : "Logo que sustituye el título de texto."}
                  </p>
                </div>

                <label className="cover-upload">
                  {busy
                    ? "Subiendo…"
                    : media
                      ? "Cambiar imagen"
                      : "Subir imagen"}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={
                      busy
                    }
                    onChange={(
                      event
                    ) => {
                      const file =
                        event
                          .target
                          .files?.[0];

                      uploadMedia(
                        target,
                        game.slug,
                        game.name,
                        file
                      );

                      event.target.value =
                        "";
                    }}
                  />
                </label>

                {media && (
                  <button
                    className="mini-delete"
                    type="button"
                    onClick={() =>
                      removeMedia(
                        target,
                        game.slug
                      )
                    }
                  >
                    Quitar imagen
                  </button>
                )}
              </article>
            );
          }
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="admin-card">
        <p>
          Biblioteca visual
        </p>

        <h2>
          Cargando imágenes…
        </h2>
      </section>
    );
  }

  return (
    <section className="image-manager">
      <div className="payment-intro">
        <div>
          <p>
            Identidad visual
          </p>

          <h2>
            Logos de cada TCG.
          </h2>

          <span>
            Estos logos reemplazan
            el título de texto de
            Pokémon, Riftbound y
            Yu-Gi-Oh! en la página
            principal y dentro de
            cada catálogo.
          </span>
        </div>

        <b>LOGOS</b>
      </div>

      {renderCards(
        "logo",
        logos
      )}

      <div
        className="payment-intro"
        style={{
          marginTop: 70,
        }}
      >
        <div>
          <p>
            Página principal
          </p>

          <h2>
            Portadas de inicio.
          </h2>

          <span>
            Son las tres tarjetas
            principales que aparecen
            debajo de “Elige tu
            universo”.
          </span>
        </div>

        <b>INICIO</b>
      </div>

      {renderCards(
        "home",
        homeCovers
      )}

      <div
        className="payment-intro"
        style={{
          marginTop: 70,
        }}
      >
        <div>
          <p>
            Catálogos
          </p>

          <h2>
            Portadas internas.
          </h2>

          <span>
            Estas imágenes aparecen
            cuando entras a Pokémon,
            Riftbound o Yu-Gi-Oh!.
            Ahora se muestran sin
            deformarlas ni ampliarlas
            excesivamente.
          </span>
        </div>

        <b>CATÁLOGOS</b>
      </div>

      {renderCards(
        "catalog",
        catalogCovers
      )}

      <section
        className="admin-card image-guidance"
        style={{
          marginTop: 30,
        }}
      >
        <p>
          Tamaños recomendados
        </p>

        <span>
          Para portadas utiliza
          imágenes de aproximadamente
          1600×900 o 1920×1080. Para
          logos utiliza PNG o WebP con
          fondo transparente y formato
          horizontal.
        </span>
      </section>
    </section>
  );
}