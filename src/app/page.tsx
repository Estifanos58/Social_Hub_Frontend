import Image from "next/image";
import AuthPage from "./auth/page";
import Link from "next/link";

export default function Home() {
  return (
   <Link href="/auth" className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
   Auth
   </Link>
  );
}
