"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { GET_CURRENT_USER } from "@/graphql/queries/auth/getCurrentUser";
import { GetMeQuery } from "@/gql/graphql";
import { useUserStore } from "@/store/userStore";

const PUBLIC_ROUTES = [
  "/auth",
  "/auth/resetpassword",
  "/auth/verify",
];

const LoadingScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 20% 20%, #1f2937, #0b1120)",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "6px solid rgba(148, 163, 184, 0.3)",
        borderTopColor: "#38bdf8",
        animation: "spin 1s linear infinite",
      }}
    />
    <div style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: 8, fontSize: 20, fontWeight: 600 }}>Preparing your feed…</h2>
      <p style={{ margin: 0, color: "#94a3b8" }}>
        We’re verifying your session and loading personalized content.
      </p>
    </div>
    <style jsx>{`
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

type Props = {
  children: ReactNode;
};

const mapUser = (user: NonNullable<GetMeQuery["getme"]>) => ({
  id: user.id,
  firstname: user.firstname ?? "",
  lastname: user.lastname ?? "",
  email: user.email ?? "",
  avatarUrl: user.avatarUrl ?? undefined,
  lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : undefined,
  bio: user.bio ?? undefined,
  verified: user.verified ?? false,
  isPrivate: user.isPrivate ?? false,
  isFollowing: (user as any).isFollowing ?? false,
  createdAt: user.createdAt ?? new Date().toISOString(),
  updatedAt: user.updatedAt ?? new Date().toISOString(),
});

export default function ProtectedRoute({ children }: Props) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, accessToken, setUser, clearAuth } = useUserStore();

  const [loading, setLoading] = useState(true);

  const isPublicRoute = useMemo(
    () => PUBLIC_ROUTES.some((route) => pathname.startsWith(route)),
    [pathname],
  );

  const redirectToAuth = useCallback(() => {
    const redirectParam = searchParams?.get("redirectTo") ?? undefined;
    const fallback = `${pathname}${(() => {
      const search = searchParams?.toString();
      if (!search) {
        return "";
      }
      const cleaned = new URLSearchParams(search);
      cleaned.delete("redirectTo");
      const remaining = cleaned.toString();
      return remaining ? `?${remaining}` : "";
    })()}`;

    const target = redirectParam ? decodeURIComponent(redirectParam) : fallback;

    if (!target || target.startsWith("/auth")) {
      router.replace("/auth");
      return;
    }

    router.replace(`/auth?redirectTo=${encodeURIComponent(target)}`);
  }, [pathname, router, searchParams]);

  const [
    fetchUser,
    { data: userData, loading: queryingUser, error: userError },
  ] = useLazyQuery<GetMeQuery>(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const refreshToken = window.localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearAuth();
      redirectToAuth();
      setLoading(false);
      return;
    }

    if (user && accessToken) {
      setLoading(false);
      return;
    }

    fetchUser().catch(() => {
      window.localStorage.removeItem("refreshToken");
      clearAuth();
      redirectToAuth();
      setLoading(false);
    });
  }, [
    accessToken,
    clearAuth,
    fetchUser,
    isPublicRoute,
    redirectToAuth,
    user,
  ]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    if (userData.getme) {
      setUser(mapUser(userData.getme));
      setLoading(false);
      return;
    }

    window.localStorage.removeItem("refreshToken");
    clearAuth();
    redirectToAuth();
    setLoading(false);
  }, [clearAuth, redirectToAuth, setUser, userData]);

  useEffect(() => {
    if (!userError) {
      return;
    }

    window.localStorage.removeItem("refreshToken");
    clearAuth();
    redirectToAuth();
    setLoading(false);
  }, [clearAuth, redirectToAuth, userError]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading || queryingUser) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
