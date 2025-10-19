import { USER_DISCONNECT_SUBSCRIPTION } from "@/graphql/subscriptions/UserDisconnect";
import { USER_ONLINE_SUBSCRIPTION } from "@/graphql/subscriptions/UserOnline";
import { useApolloClient } from "@apollo/client/react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface PresenceState {
  isOnline: boolean;
  lastSeenAt: string | null;
}

export type PresenceMap = Record<string, PresenceState>;

interface UseUserPresenceOptions {
  userIds: Array<string | null | undefined>;
  initialLastSeen?: Record<string, string | null | undefined>;
}

interface PresenceSubscriptions {
  online: { unsubscribe: () => void };
  disconnect: { unsubscribe: () => void };
}

export const useUserPresence = ({
  userIds,
  initialLastSeen = {},
}: UseUserPresenceOptions): PresenceMap => {
  const client = useApolloClient();
  const [presence, setPresence] = useState<PresenceMap>({});
  const subscriptionsRef = useRef<Map<string, PresenceSubscriptions>>(new Map());

  const normalizedIds = useMemo(
    () => Array.from(new Set(userIds.filter((id): id is string => Boolean(id)))),
    [userIds],
  );

  const normalizedInitialLastSeen = useMemo(() => {
    const source = initialLastSeen ?? {};
    const snapshot: Record<string, string | null> = {};

    normalizedIds.forEach((userId) => {
      if (!(userId in source)) return;
      const value = source[userId];
      snapshot[userId] = value ?? null;
    });

    return snapshot;
  }, [initialLastSeen, normalizedIds]);

  useEffect(() => {
    if (!normalizedIds.length) return;

    setPresence((prev) => {
      let didChange = false;
      const next = { ...prev };

      normalizedIds.forEach((userId) => {
        if (!(userId in normalizedInitialLastSeen)) return;
        const lastSeen = normalizedInitialLastSeen[userId];
        const existing = next[userId];

        if (existing?.isOnline) {
          return;
        }

        if (!existing || existing.lastSeenAt !== lastSeen) {
          next[userId] = {
            isOnline: existing?.isOnline ?? false,
            lastSeenAt: lastSeen,
          };
          didChange = true;
        }
      });

      return didChange ? next : prev;
    });
  }, [normalizedIds, normalizedInitialLastSeen]);

  useEffect(() => {
    const subscriptionMap = subscriptionsRef.current;
    const activeIds = new Set(normalizedIds);

    subscriptionMap.forEach((subscriptions, userId) => {
      if (!activeIds.has(userId)) {
        subscriptions.online.unsubscribe();
        subscriptions.disconnect.unsubscribe();
        subscriptionMap.delete(userId);
        setPresence((prev) => {
          if (!(userId in prev)) return prev;
          const { [userId]: _removed, ...rest } = prev;
          return rest;
        });
      }
    });

    normalizedIds.forEach((userId) => {
      if (subscriptionMap.has(userId)) return;

      const online = client
        .subscribe<{ userOnline?: { userId: string } }>({
          query: USER_ONLINE_SUBSCRIPTION,
          variables: { userId },
        })
        .subscribe({
          next: ({ data }: { data?: { userOnline?: { userId: string } } }) => {
            const payload = data?.userOnline;
            if (!payload) return;
            setPresence((prev) => ({
              ...prev,
              [userId]: {
                isOnline: true,
                lastSeenAt: null,
              },
            }));
          },
          error: (error: unknown) => {
            console.error("userOnline subscription error", error);
          },
        });

      const disconnect = client
        .subscribe<{ userDisconnect?: { userId: string; lastSeenAt?: string | null } }>({
          query: USER_DISCONNECT_SUBSCRIPTION,
          variables: { userId },
        })
        .subscribe({
          next: ({ data }: { data?: { userDisconnect?: { userId: string; lastSeenAt?: string | null } } }) => {
            const payload = data?.userDisconnect;
            if (!payload) return;
            setPresence((prev) => ({
              ...prev,
              [userId]: {
                isOnline: false,
                lastSeenAt: payload.lastSeenAt ?? null,
              },
            }));
          },
          error: (error: unknown) => {
            console.error("userDisconnect subscription error", error);
          },
        });

      subscriptionMap.set(userId, { online, disconnect });
    });
  }, [client, normalizedIds]);

  useEffect(
    () => () => {
      const subscriptionMap = subscriptionsRef.current;
      subscriptionMap.forEach(({ online, disconnect }) => {
        online.unsubscribe();
        disconnect.unsubscribe();
      });
      subscriptionMap.clear();
    },
    [],
  );

  return presence;
};
