import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Edit2, Lock, Trash2 } from "lucide-react";
import * as React from "react";
import { Label } from "./label";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/lib/states";

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
                    className="flex flex-row items-end mb-2 mx-2 font-normal italic text-[12px] text-gray-400"
                    htmlFor="message"
                >
                    {
                        props.isprivate && <Lock size={16} className="mr-2" />
                    }
                    <span>
                        {dayjs(props.date).format("dddd HH:mmu - DD MMMM YYYY")}
                    </span>
                    {
                        isLoggedIn === "admin" && <div className="flex flex-row justify-center items-center gap-2 mx-2">
                            <span>|</span>
                            <Edit2 className="hover:text-blue-700 cursor-pointer" size={16} onClick={() => props.onEdit(props.id)} />
                            <Trash2 className="hover:text-red-700 cursor-pointer" size={16} onClick={() => confirm("Are you sure?") && props.onDelete(props.id)} />
                        </div>
                    }
                </Label>
                <p
                    className="rounded-md border border-gray-600 bg-zinc-900 whitespace-pre-line p-3"
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

