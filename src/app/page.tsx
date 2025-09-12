'use client';
import { LeftSideBar } from "@/components/custom/LeftSideBar";
import MainPage from "@/components/custom/MainPage";
import { GetMeQuery } from "@/gql/graphql";
import { GET_CURRENT_USER } from "@/graphql/queries/auth/getCurrentUser";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AppLayout = () => {


  const { data, loading, error } = useQuery<GetMeQuery>(GET_CURRENT_USER);
  const {setUser} = useUserStore()
  const navigate = useRouter();

  useEffect(() => {
    console.log('User data', data?.getme)
    if (data?.getme) {
      setUser(data.getme as any);
    }
    if(!loading && !data?.getme){
      navigate.push('/auth')
    }
  }, [data]);

  if(loading){
    return <p>Loading</p>
  }
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <LeftSideBar />
      {/* Main Content */}
      <MainPage />
    </div>
  );
};
export default AppLayout;

