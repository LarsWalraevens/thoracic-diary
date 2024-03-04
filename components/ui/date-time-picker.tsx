"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";

export function DateTimePicker(props: {
    onChange: React.Dispatch<React.SetStateAction<Date | undefined>>;
    value: Date;
}) {
    const { value, onChange } = props;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "flex w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-h-[300px] overflow-y-auto dialog-scroll">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    initialFocus
                />
                <div className="p-3 border-t border-border">
                    <TimePicker setDate={onChange} date={value} />
                </div>
            </PopoverContent>
        </Popover>
    );
}