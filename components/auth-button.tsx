"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  User,
} from "@supabase/supabase-js";

import {
  supabase,
} from "@/lib/supabase";

import {
  AuthModal,
} from "@/components/auth-modal";

type Profile = {
  full_name:
    | string
    | null;

  avatar_url:
    | string
    | null;

  role:
    | "admin"
    | "customer"
    | null;
};

export function AuthButton() {
  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null
    );

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (!supabase) {
      setLoading(
        false
      );

      return;
    }

    const client =
      supabase;

    const loadUser =
      async (
        currentUser:
          User | null
      ) => {
        setUser(
          currentUser
        );

        if (
          !currentUser
        ) {
          setProfile(
            null
          );

          setLoading(
            false
          );

          return;
        }

        const {
          data,
          error,
        } =
          await client
            .from(
              "profiles"
            )
            .select(
              "full_name,avatar_url,role"
            )
            .eq(
              "id",
              currentUser.id
            )
            .maybeSingle();

        if (error) {
          console.error(
            "Error cargando perfil:",
            error
          );
        }

        setProfile(
          (data ??
            null) as
            | Profile
            | null
        );

        setLoading(
          false
        );
      };

    const initialize =
      async () => {
        const {
          data,
        } =
          await client.auth
            .getUser();

        await loadUser(
          data.user ??
            null
        );
      };

    initialize();

    const {
      data:
        listener,
    } =
      client.auth
        .onAuthStateChange(
          async (
            _event,
            session
          ) => {
            await loadUser(
              session?.user ??
                null
            );
          }
        );

    return () => {
      listener
        .subscription
        .unsubscribe();
    };
  }, []);

  useEffect(() => {
    const clickOutside = (
      event:
        MouseEvent
    ) => {
      if (
        !wrapperRef.current
      ) {
        return;
      }

      if (
        !wrapperRef.current
          .contains(
            event.target as
              Node
          )
      ) {
        setMenuOpen(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      clickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        clickOutside
      );
    };
  }, []);

  const signOut =
    async () => {
      if (!supabase) {
        return;
      }

      await supabase.auth
        .signOut();

      setMenuOpen(
        false
      );
    };

  if (loading) {
    return (
      <span
        style={{
          display:
            "block",

          width:
            "88px",

          height:
            "34px",

          borderRadius:
            "999px",

          background:
            "rgba(120,130,150,.12)",
        }}
      />
    );
  }

  if (!user) {
    return (
      <>
        <button
          type="button"
          className="account"
          onClick={() =>
            setModalOpen(
              true
            )
          }
        >
          Iniciar sesión
        </button>

        <AuthModal
          open={
            modalOpen
          }
          onClose={() =>
            setModalOpen(
              false
            )
          }
        />
      </>
    );
  }

  const metadata =
    user.user_metadata ??
    {};

  const name =
    profile?.full_name ||
    metadata.full_name ||
    metadata.name ||
    user.email
      ?.split("@")[0] ||
    "Cuenta";

  const avatar =
    profile?.avatar_url ||
    metadata.avatar_url ||
    metadata.picture ||
    null;

  const isAdmin =
    profile?.role ===
    "admin";

  return (
    <div
      ref={
        wrapperRef
      }
      style={{
        position:
          "relative",

        display:
          "flex",

        alignItems:
          "center",

        gap:
          "8px",
      }}
    >
      {isAdmin && (
        <Link
          href="/admin"
          className="admin"
        >
          Admin
        </Link>
      )}

      <button
        type="button"
        className="account"
        onClick={() =>
          setMenuOpen(
            (current) =>
              !current
          )
        }
        style={{
          display:
            "inline-flex",

          alignItems:
            "center",

          gap:
            "8px",
        }}
      >
        {avatar ? (
          <span
            style={{
              width:
                "26px",

              height:
                "26px",

              flex:
                "0 0 26px",

              borderRadius:
                "50%",

              backgroundImage:
                `url("${avatar}")`,

              backgroundSize:
                "cover",

              backgroundPosition:
                "center",
            }}
          />
        ) : (
          <span
            style={{
              width:
                "26px",

              height:
                "26px",

              flex:
                "0 0 26px",

              display:
                "grid",

              placeItems:
                "center",

              borderRadius:
                "50%",

              background:
                "rgba(110,100,220,.15)",

              fontSize:
                "10px",

              fontWeight:
                800,
            }}
          >
            {name
              .slice(
                0,
                1
              )
              .toUpperCase()}
          </span>
        )}

        <span>
          {name}
        </span>

        <span
          style={{
            fontSize:
              "9px",

            opacity:
              .6,
          }}
        >
          ▾
        </span>
      </button>

      {menuOpen && (
        <div
          style={{
            position:
              "absolute",

            top:
              "calc(100% + 10px)",

            right:
              0,

            zIndex:
              1000,

            width:
              "220px",

            padding:
              "8px",

            border:
              "1px solid rgba(120,130,150,.18)",

            borderRadius:
              "14px",

            background:
              "#fff",

            color:
              "#11182b",

            boxShadow:
              "0 18px 50px rgba(0,0,0,.16)",
          }}
        >
          <div
            style={{
              padding:
                "10px",

              marginBottom:
                "5px",

              borderBottom:
                "1px solid #eef0f4",
            }}
          >
            <b
              style={{
                display:
                  "block",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",

                fontSize:
                  "11px",
              }}
            >
              {name}
            </b>

            <span
              style={{
                display:
                  "block",

                marginTop:
                  "4px",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",

                color:
                  "#8791a4",

                fontSize:
                  "9px",
              }}
            >
              {user.email}
            </span>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() =>
                setMenuOpen(
                  false
                )
              }
              style={{
                minHeight:
                  "36px",

                display:
                  "flex",

                alignItems:
                  "center",

                padding:
                  "0 10px",

                borderRadius:
                  "8px",

                color:
                  "#242d42",

                textDecoration:
                  "none",

                fontSize:
                  "10px",
              }}
            >
              Administración
            </Link>
          )}

          <button
            type="button"
            onClick={
              signOut
            }
            style={{
              width:
                "100%",

              minHeight:
                "36px",

              border:
                0,

              borderRadius:
                "8px",

              padding:
                "0 10px",

              background:
                "transparent",

              color:
                "#a94858",

              textAlign:
                "left",

              fontSize:
                "10px",

              cursor:
                "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}