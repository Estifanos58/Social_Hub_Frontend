import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";

import { useUserStore } from "./src/store/userStore";

loadErrorMessages();
loadDevMessages();

// 🔹 HTTP Link for queries & mutations
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include", // keep compatibility with cookie-based flows
});

// 🔹 Attach auth headers to every HTTP request
const authLink = setContext((_, { headers }) => {
  const { accessToken } = useUserStore.getState();
  const nextHeaders: Record<string, string> = {};

  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        nextHeaders[key] = value;
      });
    } else {
      Object.assign(nextHeaders, headers as Record<string, string>);
    }
  }

  if (accessToken) {
    nextHeaders.Authorization = `Bearer ${accessToken}`;
  }

  if (typeof window !== "undefined") {
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken) {
      nextHeaders["x-refresh-token"] = refreshToken;
    }
  }

  return {
    headers: nextHeaders,
  };
});

// 🔹 Capture refreshed tokens from responses
const afterwareLink = new ApolloLink((operation, forward) =>
  new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        if (typeof window !== "undefined") {
          const contextResponse = operation.getContext().response as Response | undefined;
          const accessFromHeader = contextResponse?.headers?.get("x-access-token");
          const refreshFromHeader = contextResponse?.headers?.get("x-refresh-token");

          if (accessFromHeader) {
            useUserStore.getState().setAccessToken(accessFromHeader);
          }

          if (refreshFromHeader) {
            window.localStorage.setItem("refreshToken", refreshFromHeader);
          }
        }

        observer.next(result);
      },
      error: (error) => observer.error?.(error),
      complete: () => observer.complete?.(),
    });

    return () => {
      subscription.unsubscribe();
    };
  }),
);

// 🔹 WebSocket Link for subscriptions
const wsLink = typeof window !== "undefined"
  ? new GraphQLWsLink(
      createClient({
        url: process.env.NEXT_PUBLIC_WS_URL!,
        retryAttempts: 3,
        connectionParams: () => {
          const { accessToken } = useUserStore.getState();
          const params: Record<string, string> = {};

          if (accessToken) {
            params.Authorization = `Bearer ${accessToken}`;
          }

          const refreshToken = window.localStorage.getItem("refreshToken");
          if (refreshToken) {
            params["x-refresh-token"] = refreshToken;
          }

          return params;
        },
      }),
    )
  : null;

const httpPipeline = ApolloLink.from([authLink, afterwareLink, httpLink]);

// 🔹 Split based on operation type
const splitLink = wsLink
  ? ApolloLink.split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink, // subscriptions go here
      httpPipeline // queries & mutations go here
    )
  : httpPipeline;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});
