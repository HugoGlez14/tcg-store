"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;

    client.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleAccount = async () => {
    if (!supabase || busy) return;

    setBusy(true);

    try {
      if (user) {
        await supabase.auth.signOut();
        return;
      }

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`,
        },
      });
    } finally {
      setBusy(false);
    }
  };

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Cuenta";

  return (
    <button
      className="account"
      type="button"
      onClick={handleAccount}
      disabled={!supabase || busy}
      title={user?.email ?? "Iniciar sesión con Google"}
    >
      {busy
        ? "Procesando…"
        : user
        ? `Salir · ${displayName}`
        : "Iniciar sesión"}
    </button>
  );
}