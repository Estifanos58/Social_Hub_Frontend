'use client';

import { GetMeQuery } from "@/gql/graphql";
import { GET_CURRENT_USER } from "@/graphql/queries/auth/getCurrentUser";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data, loading, error } = useQuery<GetMeQuery>(GET_CURRENT_USER);
  const { setUser } = useUserStore();
  const navigate = useRouter();

  useEffect(() => {
    console.log("User data", data?.getme);
    if (data?.getme) {
      setUser(data.getme as any);
    }
    if ((!loading && !data?.getme) || error ) {
      navigate.push("/auth");
    }
  }, [data]);

  if (loading) {
    return <p>Loading</p>;
  }
  return <>{children}</>;
}
