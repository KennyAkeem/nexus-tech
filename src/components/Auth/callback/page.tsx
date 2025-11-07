'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/**
 * Auth callback page that handles supabase magic-link / OAuth callbacks.
 * - Uses supabase.auth.getSessionFromUrl() when available (safe runtime check)
 * - Falls back to parsing tokens from URL fragment / query and calling supabase.auth.setSession
 * - After session is established reconciles profile and redirects to /profile
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const parseHashTokens = (href: string) => {
      // e.g. access_token=...&refresh_token=... in fragment after #
      const hashIndex = href.indexOf('#');
      const fragment = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      const params = new URLSearchParams(fragment);
      return {
        access_token: params.get('access_token'),
        refresh_token: params.get('refresh_token'),
        type: params.get('type'),
      };
    };

    const handleCallback = async () => {
      setStatus("loading");
      setError(null);

      try {
        let user = null;

        // Prefer calling getSessionFromUrl if it exists (supabase-js v2 exposes it in some versions)
        const authAny = supabase.auth as any;
        if (typeof authAny.getSessionFromUrl === "function") {
          // storeSession: true -> stores session in localStorage/cookie depending on client setup
          const result = await authAny.getSessionFromUrl?.({ storeSession: true });
          // result may contain data.session
          user = result?.data?.session?.user ?? null;
        }

        // If we didn't get a user from getSessionFromUrl, try fallbacks:
        if (!user) {
          // 1) Try reading tokens from query params (older links)
          const access_token_q = searchParams.get("access_token");
          const refresh_token_q = searchParams.get("refresh_token");
          const type_q = searchParams.get("type");

          if (type_q === "signup" && access_token_q && refresh_token_q) {
            const { error: setErr } = await supabase.auth.setSession({
              access_token: access_token_q,
              refresh_token: refresh_token_q,
            });
            if (setErr) {
              setError(setErr.message);
              setStatus("error");
              return;
            }
            const { data: userData } = await supabase.auth.getUser();
            user = userData?.user ?? null;
          } else {
            // 2) Try parsing fragment (#access_token=...) — Supabase magic links often put tokens in the fragment
            const { access_token, refresh_token, type } = parseHashTokens(window.location.href);
            if (type === "signup" && access_token && refresh_token) {
              const { error: setErr } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              });
              if (setErr) {
                setError(setErr.message);
                setStatus("error");
                return;
              }
              const { data: userData } = await supabase.auth.getUser();
              user = userData?.user ?? null;
            }
          }
        }

        if (!mounted) return;

        // If we have a user, reconcile profile using optional name/email query params
        if (user?.id) {
          try {
            const name = searchParams.get("name") ?? undefined;
            const email = searchParams.get("email") ?? undefined;

            // fetch existing profile
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("name")
              .eq("id", user.id)
              .single();

            // ignore "no rows" error code in some setups
            if (profileError && (profileError as any).code !== "PGRST116") {
              console.warn("profiles select error:", profileError);
            }

            const existingName = (profile as any)?.name ?? null;

            if (name && name.trim().length > 0 && (!existingName || existingName === "New User")) {
              const { error: upsertErr } = await supabase.from("profiles").upsert({
                id: user.id,
                name: name.trim(),
                email: email ?? undefined,
              });

              if (upsertErr) {
                console.warn("Error upserting profile name after confirmation:", upsertErr);
              }
            }
          } catch (e) {
            console.error("Error reconciling profile after confirmation:", e);
          }
        }

        setStatus("done");
        // Use replace so the token params are not kept in history
        router.replace("/profile");
      } catch (err: any) {
        console.error("Error handling auth callback:", err);
        setError(err?.message ?? "Failed to process authentication callback.");
        setStatus("error");
      }
    };

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-3">Activating your account...</p>
          <p className="text-sm text-gray-400">Please wait while we finish sign-in.</p>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-500 font-semibold text-lg">
          Account activated successfully. Redirecting...
        </p>
      </div>
    );
  }

  // error case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 font-bold mb-2">Activation failed</p>
        <p className="text-gray-400 text-sm">{error ?? "Unknown error."}</p>
      </div>
    </div>
  );
}