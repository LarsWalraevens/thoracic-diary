import cookie from "cookie";
import { useAtom } from "jotai";
import AddPost from "../modals/add-post";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { isLoggedInAtom } from "@/lib/states";

export default function PageLayout(props: {
    children: React.ReactNode;
}) {
    const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

    return <>
        <header className="h-20 w-screen mx-auto max-w-[1200px] px-4 flex items-center justify-between">
            {
                isLoggedIn === "admin" && <AddPost />
            }
            <div className="flex items-center justify-end flex-row gap-4 w-full h-full">

                <Dialog>
                    <DialogTrigger asChild>
                        <button className="font-medium hover:text-blue-500">Help</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px]">
                        <DialogHeader>
                            <DialogTitle>My thoracic outlet syndrome diary</DialogTitle>
                        </DialogHeader>
                        <p>
                            Here, I will share daily updates on my progress and how Im feeling. This diary is for my personal use, helping me to track my journey more effectively.
                        </p>
                    </DialogContent>
                </Dialog>
                {
                    isLoggedIn &&
                    <button onClick={() => {
                        setIsLoggedIn(false);
                        window.document.cookie = cookie.serialize("rememberUser", "", { path: "/", secure: true, maxAge: 0 });
                    }} className="font-medium hover:text-blue-500">Logout</button>
                }
            </div>
        </header >
        <main className="mx-auto max-w-[1200px] px-4 my-10">
            {props.children}
        </main>
    </>
}