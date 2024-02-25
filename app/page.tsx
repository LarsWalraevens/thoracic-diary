"use client"

import LoginPage from "@/components/pages/login-page";
import PostsPage from "@/components/pages/posts-page";
import { isLoggedInAtom } from "@/lib/states";
import { useAtom } from "jotai";

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
