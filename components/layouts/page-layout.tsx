import { isLoggedInAtom } from "@/lib/states";
import cookie from "cookie";
import dayjs from "dayjs";
import "dayjs/locale/nl-be";
import { useAtom } from "jotai";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import AddPost from "../modals/add-post";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
dayjs.locale('nl-be')

export default function PageLayout(props: {
    children: React.ReactNode;
    className?: string;
}) {
    const cookies = cookie.parse(document.cookie);
    const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
    const [isTopPage, setIsTopPage] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(cookies.darkLightMode !== undefined ? cookies.darkLightMode === "dark" ? true : false : true);
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
        if (!isLoggedIn) return
        if (window.scrollY === 0 && !isTopPage) {
            setIsTopPage(true);
        }
        if (window.scrollY > 0 && isTopPage) {
            setIsTopPage(false);
        }
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            document.getElementsByTagName("header")[0]!.style.top = "0";
        } else {
            document.getElementsByTagName("header")[0]!.style.top = "-150px";
        }
        prevScrollpos = currentScrollPos;
    }

    useEffect(() => {
        if (!cookies.darkLightMode) return
        const htmlElement = document.getElementsByTagName("html");
        if (!htmlElement) return;
        const htmlEle = document.getElementsByTagName("html")[0];
        if (!htmlEle) return;
        const myIsDarkMode = cookies.darkLightMode === "dark" ? true : false
        if (myIsDarkMode && !htmlEle.classList.contains("dark")) {
            htmlEle.classList.add("dark");
        } else {
            htmlEle.classList.remove("dark");
        }
    }, []);

    function toggleDarkMode() {
        const htmlElement = document.getElementsByTagName("html");
        if (!htmlElement) return;
        const htmlEle = document.getElementsByTagName("html")[0];
        if (!htmlEle) return;
        const newMode = !isDarkMode;
        document.cookie = cookie.serialize("darkLightMode", newMode === true ? "dark" : "light", { path: "/", maxAge: 60 * 60 * 24 * 30 });
        setIsDarkMode(newMode);
        if (newMode && !htmlEle.classList.contains("dark")) {
            htmlEle.classList.add("dark");
        } else {
            htmlEle.classList.remove("dark");
        }
    }

    return <>
        <header className={`w-full relative h-20 duration-1000  z-10`}>
            <div className={`w-full h-20 ${isTopPage ? '' : isLoggedIn ? ' fixed  dark:bg-zinc-950 bg-white  dark:border-b-slate-900 border-b' : ''}`}>
                <div className="mx-auto max-w-[1200px] h-full px-4 flex items-center justify-between">
                    <p className="mb-0 font-bold flex flex-row items-center text-lg">
                        <span title="Logo" className="scale-125 p-3 bg-zinc-950 rounded-full">{logoSvg}</span>
                    </p>
                    <div className="flex items-center justify-end flex-row gap-4 w-full h-full">
                        {
                            isLoggedIn === "admin" && <>
                                <AddPost />
                                <span className="text-gray-400 max-md:hidden">-</span></>
                        }
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="font-medium hover:text-blue-500">Help</button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[725px]">
                                <DialogHeader>
                                    <DialogTitle className="text-left">Help - wat is dit?</DialogTitle>
                                </DialogHeader>
                                <p>
                                    {/* This is a diary where I will post updates on how I feel during the day when struggling with symptoms of thoracic outlet syndrome. So I can focus on what triggers it and to track the journey more effectively. This diary is meant for personal use only. */}
                                    Dit is een dagboek waar ik updates post wanneer ik last heb van symptonen van thoracic outlet symdroom tijdens de dag. Zodat ik meer overzicht krijg  en meer kan focussen op welke triggers er zijn. Dit dagboek is voor persoonlijk gebruik.
                                </p>
                            </DialogContent>
                        </Dialog>
                        {
                            isLoggedIn &&
                            <button onClick={() => {
                                setIsLoggedIn(false);
                                window.document.cookie = cookie.serialize("userSecret", "", { path: "/", secure: true, maxAge: 0 });
                            }} className="font-medium hover:text-blue-500">Logout</button>
                        }
                        {
                            isDarkMode ? <Sun className="hover:text-blue-500 cursor-pointer" onClick={() => toggleDarkMode()} /> :
                                <Moon className="hover:text-blue-500 cursor-pointer" onClick={() => toggleDarkMode()} />
                        }
                    </div>
                </div>
            </div>
        </header >
        <main className={`mx-auto max-w-[1200px] z-[1] relative px-4 my-7 max-lg:my-5 ${props.className || ''}`}>
            {props.children}
        </main>
    </>
}

const logoSvg = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="12.8571" height="12.8571" rx="6.42857" fill="white"></rect><path d="M5.75403 16.7773C5.87489 16.5356 6.1041 16.3663 6.37067 16.3219L10.5035 15.6331C13.4995 15.1337 15.7811 12.6755 16.056 9.65075L16.3512 6.40444C16.3771 6.11953 16.5485 5.86829 16.8044 5.74035C17.3537 5.46571 18 5.86513 18 6.47924V13.0887C18 15.801 15.8012 17.9997 13.089 17.9997H6.50953C5.88162 17.9997 5.47322 17.3389 5.75403 16.7773Z" fill="white"></path></svg>;