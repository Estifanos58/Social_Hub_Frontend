import { cookies } from "next/headers";
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

const hasAccessToken = (request: NextRequest): boolean => {
  return Boolean(
    request.cookies.get("accessToken")?.value 
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }


  if (!hasAccessToken(request)) {
    return redirectToAuth(request);
  }

  const endpoint = process.env.NEXT_PUBLIC_API_URL || "https://social-hub-backend-bl70.onrender.com/graphql";

  if (!endpoint) {
    // Without a configured endpoint we cannot verify the session – fall back to allowing the request.
    return NextResponse.next();
  }

  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
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

    return NextResponse.next();
  } catch {
    return redirectToAuth(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
