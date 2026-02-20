// components/Navbar/index.js
export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import PublicNavbar from "./PublicNavbar";
import AuthNavbar from "./AuthNavbar";

export default async function NavbarWrapper() {
  let user = null

  try {
    user = await currentUser();
  } catch (err) {
    console.error('Failed to load Clerk user for Navbar:', err);
  }

  if (!user) return <PublicNavbar />;

  return (
    <AuthNavbar
      userData={{
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        email: user.emailAddresses?.[0]?.emailAddress,
        id: user.id, // You'll need this for Supabase queries
      }}
    />
  );
}
