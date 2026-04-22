import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

export default clerkMiddleware((auth, req) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract subdomain if hostname is something like teacher1.localhost:3000
  let currentHost = hostname.replace(`:${url.port}`, ""); // remove port
  const isLocalhost = currentHost.endsWith("localhost");
  
  let subdomain = null;
  if (isLocalhost && currentHost !== "localhost") {
    subdomain = currentHost.replace(".localhost", "");
  }

  // Handle subdomain routing for teacher courses
  if (subdomain && subdomain !== "www") {
    // Rewrite all requests on this subdomain to our teacher-courses route
    return NextResponse.rewrite(new URL(`/teacher-courses/${subdomain}${url.pathname}`, req.url));
  }

  // If authenticated and visiting the root/login page, redirect to the dashboard
  if (role && url.pathname === "/") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  // Check role-based access for other routes
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      if (!role) {
        // If no role, maybe they haven't been synced or set up yet
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
