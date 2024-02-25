"use client"

import LoginPage from "@/components/pages/login-page";
import PostsPage from "@/components/pages/posts-page";
import { atom, useAtom } from "jotai";

export const isLoggedInAtom = atom<false | "admin" | "user">(false);

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
