import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";

import { GET_CHATROOM_DETAIL } from "@/graphql/queries/message/getChatroomDetail";
import { ChatroomDetail } from "@/lib/types";

interface UseChatroomDetailOptions {
  chatroomId?: string | null;
  enabled?: boolean;
  initialData?: Partial<ChatroomDetail> | null;
}

interface ChatroomDetailQueryData {
  chatroomDetail: ChatroomDetail;
}

export const useChatroomDetail = ({
  chatroomId,
  enabled = true,
  initialData,
}: UseChatroomDetailOptions) => {
  const shouldSkip = !enabled || !chatroomId;

  const { data, loading, error, refetch } = useQuery<ChatroomDetailQueryData>(
    GET_CHATROOM_DETAIL,
    {
      variables: {
        chatroomId: chatroomId ?? "",
      },
      skip: shouldSkip,
      fetchPolicy: "network-only",
    },
  );

  const fallbackDetail = useMemo<ChatroomDetail | null>(() => {
    if (!chatroomId) {
      return null;
    }

    return {
      id: chatroomId,
      isGroup: initialData?.isGroup ?? false,
      name: initialData?.name ?? null,
      avatarUrl: initialData?.avatarUrl ?? null,
      totalMessages: initialData?.totalMessages ?? 0,
      totalPhotos: initialData?.totalPhotos ?? 0,
      totalMembers: initialData?.totalMembers ?? null,
      members: initialData?.members ?? null,
      directUser: initialData?.directUser ?? null,
    };
  }, [chatroomId, initialData?.avatarUrl, initialData?.directUser, initialData?.isGroup, initialData?.members, initialData?.name, initialData?.totalMembers, initialData?.totalMessages, initialData?.totalPhotos]);

  const detail = useMemo<ChatroomDetail | null>(() => {
    if (data?.chatroomDetail) {
      return data.chatroomDetail;
    }
    return fallbackDetail;
  }, [data?.chatroomDetail, fallbackDetail]);

  const hasRemoteDetail = Boolean(data?.chatroomDetail);
  const isInitialLoading = loading && !hasRemoteDetail;
  const isFetching = loading && hasRemoteDetail;

  return {
    detail,
    loading,
    isInitialLoading,
    isFetching,
  error,
    refetch,
    hasRemoteDetail,
  };
};
