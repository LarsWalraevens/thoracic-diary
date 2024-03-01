import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Edit2, Lock, Trash2 } from "lucide-react";
import * as React from "react";
import { Label } from "./label";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/lib/states";
import "dayjs/locale/nl-be"
dayjs.locale('nl-be')


export interface PostProps
    extends React.HTMLAttributes<HTMLDivElement> {
    text: string | JSX.Element;
    date: Date;
    id: string;
    isprivate: boolean;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

const Post = React.forwardRef<HTMLDivElement, PostProps>(
    ({ className, ...props }, ref) => {
        const [isLoggedIn, _] = useAtom(isLoggedInAtom);

        return (
            <div
                className={cn(
                    "",
                    className
                )}
                ref={ref}
                {...props}
            >
                <Label
                    className="flex flex-row items-end mb-2 mx-1 font-normal italic text-[12px] dark:text-gray-400 text-gray-600"
                    htmlFor="message"
                >
                    {
                        props.isprivate && <Lock size={16} className="mr-2" />
                    }
                    <span>
                        {dayjs(props.date).locale('nl-be').format("dddd HH:mmu - DD MMMM YYYY")}
                    </span>
                    {
                        isLoggedIn === "admin" && <div className="flex flex-row justify-center items-center gap-2 mx-2">
                            <span>|</span>
                            <Edit2 className="hover:text-blue-700 cursor-pointer max-md:mx-1 max-md:scale-[115%]" size={16} onClick={() => props.onEdit(props.id)} />
                            <Trash2 className="hover:text-red-700 cursor-pointer max-md:mx-1 max-md:scale-[115%]" size={16} onClick={() => confirm("Are you sure?") && props.onDelete(props.id)} />
                        </div>
                    }
                </Label>
                <p
                    className="rounded-md border dark:text-white text-black border-gray-700/80 dark:bg-zinc-900 bg-transparent whitespace-pre-line p-3"
                >
                    {
                        props.text
                    }
                </p>
            </div>
        )
    }
)
Post.displayName = "Post"

export { Post };

