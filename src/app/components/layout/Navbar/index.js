// components/Navbar/index.js
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import PublicNavbar from "./PublicNavbar";
import AuthNavbar from "./AuthNavbar";

export const dynamic = "force-dynamic";

export default async function NavbarWrapper() {
  let user = null;

  try {
    user = await currentUser();
  } catch (err) {
    console.error("Failed to load Clerk user for Navbar:", err);
  }

  const navbarContent = user ? (
    <AuthNavbar
      userData={{
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        email: user.emailAddresses?.[0]?.emailAddress,
        id: user.id,
      }}
    />
  ) : (
    <PublicNavbar />
  );

  return <Suspense fallback={<div />}>{navbarContent}</Suspense>;
}
