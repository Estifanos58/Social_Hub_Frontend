"use client";

import { GetMeQuery } from "@/gql/graphql";
import { GET_CURRENT_USER } from "@/graphql/queries/auth/getCurrentUser";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

export default function UserBootstrapper() {
  const { data } = useQuery<GetMeQuery>(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  console.log("UserBootstrapper data:", data);
  const { setUser } = useUserStore();

  useEffect(() => {
    if (data?.getme) {
      setUser(data.getme as any);
    }
  }, [data, setUser]);

  return null;
}
