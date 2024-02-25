"use client"

import { isLoggedInAtom } from "@/lib/states";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
const LoginPage = dynamic(() => import("@/components/pages/login-page"), { ssr: false });
const PostsPage = dynamic(() => import("@/components/pages/posts-page"), { ssr: false });

export default function Home() {
  const [isLoggedIn, _] = useAtom(isLoggedInAtom);

  return (
    <>
      {
        isLoggedIn ? <>
          <PostsPage />
        </> :
          <LoginPage />
      }
    </>
  );
}
