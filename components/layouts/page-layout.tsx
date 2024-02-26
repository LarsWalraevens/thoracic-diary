import { isLoggedInAtom } from "@/lib/states";
import cookie from "cookie";
import { useAtom } from "jotai";
import AddPost from "../modals/add-post";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function PageLayout(props: {
    children: React.ReactNode;
    className?: string;
}) {
    const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

    return <>
        <header className="h-20 w-screen mx-auto max-w-[1200px] px-4 flex items-center justify-between"><p className="mb-0 font-bold flex flex-row items-center text-lg">
            <span title="Logo" className="scale-125">{logoSvg}</span>
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
                            <DialogTitle className="text-left">Thoracic outlet syndrome diary</DialogTitle>
                        </DialogHeader> <p>This is a diary where I will post updates on how I feel during the day when struggling with symptoms of thoracic outlet syndrome. So I can focus on what triggers it and to track the journey more effectively. This diary is meant for personal use only.
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
            </div>
        </header >
        <main className={`mx-auto max-w-[1200px] px-4 my-6 ${props.className || ''}`}>
            {props.children}
        </main>
    </>
}

const logoSvg = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="12.8571" height="12.8571" rx="6.42857" fill="white"></rect><path d="M5.75403 16.7773C5.87489 16.5356 6.1041 16.3663 6.37067 16.3219L10.5035 15.6331C13.4995 15.1337 15.7811 12.6755 16.056 9.65075L16.3512 6.40444C16.3771 6.11953 16.5485 5.86829 16.8044 5.74035C17.3537 5.46571 18 5.86513 18 6.47924V13.0887C18 15.801 15.8012 17.9997 13.089 17.9997H6.50953C5.88162 17.9997 5.47322 17.3389 5.75403 16.7773Z" fill="white"></path></svg>;