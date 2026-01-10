import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import LibraryClient from "./LibraryClient"

export default async function LibraryPage() {
  let user;

  try {
    user = await currentUser();
  } catch (err) {
    console.error("Error fetching current user:", err);
    return redirect("/"); // fallback if user cannot be fetched
  }

  if (!user) return redirect("/");

  return <LibraryClient />
}
