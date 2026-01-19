// app/auth/signin/page.tsx
import { redirect } from "next/navigation";

export default function SignInPage() {
  // Use NextAuth's built-in sign-in page
  redirect("/api/auth/signin");
}
