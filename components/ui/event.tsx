import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { Edit2, Lock, TimerIcon, Trash2 } from "lucide-react";
import * as React from "react";
import { Label } from "./label";
import { isLoggedInAtom } from "@/lib/states";

export interface EventProps
    extends React.HTMLAttributes<HTMLDivElement> {
    text: string | JSX.Element;
    date: Date;
    id: string;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    isPrivate: boolean;
}

const Event = React.forwardRef<HTMLDivElement, EventProps>(
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
                        props.isPrivate && <Lock size={16} className="mr-2" />
                    }
                    <span>
                        Lars - {dayjs(props.date).format("MMMM DD, YYYY hh:mm A")}
                    </span>
                    {
                        isLoggedIn === "admin" && <div className="flex flex-row justify-center items-center gap-2 mx-2">
                            <span>-</span>
                            <Edit2 className="hover:text-blue-700 cursor-pointer" size={16} onClick={() => props.onEdit(props.id)} />
                            <Trash2 className="hover:text-red-700 cursor-pointer" size={16} onClick={() => confirm("Are you sure?") && props.onDelete(props.id)} />
                        </div>
                    }
                </Label>
                <div className="flex items-center  flex-row gap-4 border rounded-full shadow p-3">

                    <span title="Important event">
                        <TimerIcon size={25} className="text-sky-600" />
                    </span>
                    <div className="">
                        <p className="mb-0">
                            {
                                props.text
                            }
                        </p>

                    </div>
                </div>
            </div>
        )
    }
)
Event.displayName = "Event"

export { Event };

