// components/Navbar/index.js
import PublicNavbar from "./PublicNavbar";
import AuthNavbar from "./AuthNavbar";
import { currentUser } from "@clerk/nextjs/server";

export default async function NavbarWrapper() {
  const user = await currentUser();

  if (!user) return <PublicNavbar />;

  return (
    <AuthNavbar
      userData={{
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        email: user.emailAddresses?.[0]?.emailAddress,
      }}
    />
  );
}
