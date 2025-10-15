import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/auth",
  "/auth/resetpassword",
  "/auth/verify",
];

const GRAPHQL_INTROSPECTION_QUERY = /* GraphQL */ `
  query GetMe {
    getme {
      id
    }
  }
`;


const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_PATHS.some((route) => pathname.startsWith(route));
};

const shouldBypass = (pathname: string): boolean => {
  if (pathname.startsWith("/_next/static")) return true;
  if (pathname.startsWith("/_next/image")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/static")) return true;
  if (pathname.startsWith("/public")) return true;
  if (pathname.startsWith("/api")) return true;
  if (/\.[^/]+$/.test(pathname)) return true; // skip files like /favicon.ico
  return false;
};

const redirectToAuth = (request: NextRequest) => {
  const loginUrl = new URL("/auth", request.url);
  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
};

const extractTokens = (request: NextRequest) => {
  const authorization = request.headers.get("authorization");
  const fromAuthHeader = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  const accessToken =
    fromAuthHeader ??
    request.headers.get("x-access-token") ??
    undefined;

  const refreshToken =
    request.headers.get("x-refresh-token") ??
    undefined;

  return { accessToken, refreshToken };
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const endpoint = process.env.NEXT_PUBLIC_API_URL || "https://social-hub-backend-bl70.onrender.com/graphql";

  if (!endpoint) {
    // Without a configured endpoint we cannot verify the session – fall back to allowing the request.
    return NextResponse.next();
  }

  try {
    const { accessToken, refreshToken } = extractTokens(request);

    if (!accessToken && !refreshToken) {
      return NextResponse.next();
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      headers["x-refresh-token"] = refreshToken;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: GRAPHQL_INTROSPECTION_QUERY }),
      cache: "no-store",
    });

    if (!response.ok) {
      return redirectToAuth(request);
    }

    const result = (await response.json()) as {
      data?: { getme?: { id: string } | null };
      errors?: unknown;
    };

    if (!result?.data?.getme?.id) {
      return redirectToAuth(request);
    }

    const nextResponse = NextResponse.next();
    const forwardedAccess = response.headers.get("x-access-token");
    const forwardedRefresh = response.headers.get("x-refresh-token");

    if (forwardedAccess) {
      nextResponse.headers.set("x-access-token", forwardedAccess);
    }

    if (forwardedRefresh) {
      nextResponse.headers.set("x-refresh-token", forwardedRefresh);
    }

    return nextResponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
