import { atom } from "jotai";

export const isLoggedInAtom = atom<false | "admin" | "user">(false);