"use client";

import { GetMeQuery } from "@/gql/graphql";
import { GET_CURRENT_USER } from "@/graphql/queries/auth/getCurrentUser";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data, loading, error } = useQuery<GetMeQuery>(GET_CURRENT_USER, {
    fetchPolicy: "network-only", // always fetch fresh user data
  });
  const { setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until query finishes

    if (data?.getme) {
      setUser(data.getme as any);
    } else {
      return router.replace("/auth"); // redirect when no user
    }
  }, [loading, data, error, setUser, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
