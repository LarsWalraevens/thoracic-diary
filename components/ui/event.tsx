import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { AlertTriangle, CalendarClock, Edit2, Lock, TimerIcon, Trash2 } from "lucide-react";
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
    isprivate: boolean;
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
                <div className="flex items-start flex-row gap-4 border-l-4 border-l-sky-600 border-r border-t border-b border-r-sky-900/50 border-b-sky-900/50 border-t-sky-900/50 dark:bg-slate-900 bg-sky-200 dark:text-white text-black full p-3">

                    <span title="Important event" className="max-md:hidden">
                        <AlertTriangle size={25} className="text-sky-600" />
                    </span>
                    <div className="">
                        <p className="mb-0 whitespace-pre-line">
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

