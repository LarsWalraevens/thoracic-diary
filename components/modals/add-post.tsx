import { MyPost, postsAtom } from "@/components/pages/posts-page";
import symptoms from "@/lib/symptoms.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { DateTimePicker } from "../ui/date-time-picker";
import dayjs from "dayjs";
import "dayjs/locale/nl-be"
import { toast } from "sonner";
dayjs.locale('nl-be')


export default function AddPost() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [posts, _] = useAtom(postsAtom);
    const queryClient = useQueryClient();
    const mutateNewPost = useMutation({
        mutationKey: ["newPost"],
        mutationFn: (propsFn: {
            text: string,
            type: string,
            tags: string,
            isprivate: boolean,
            date: Date
        }) => fetch("/api/add", {
            method: "POST",
            body: JSON.stringify({
                ...propsFn
            }),
        }).then((res) => res.json()),
        retry: false,
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['getPosts'], type: 'active' })
        },
        onSuccess: () => {
            form.reset();
            setIsDialogOpen(false);
            toast.success("Post created");
        },
        onError: () => toast.error("Error", { description: "Something went wrong while trying to add a post" })
    });

    const mutateEditPost = useMutation({
        mutationKey: ["editPost"],
        mutationFn: (propsFn: {
            text: string,
            type: string,
            tags: string,
            isprivate: boolean;
            id: string;
            date: Date;
        }) => fetch("/api/edit", {
            method: "POST",
            body: JSON.stringify({
                ...propsFn
            }),
        }).then((res) => res.json()),
        retry: false,
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['getPosts'], type: 'active' })
        },
        onSuccess: () => {
            form.reset();
            router.replace("/");
            setIsDialogOpen(false);
            toast.success("Post updated");
        },
        onError: () => toast.error("Error", { description: "Something went wrong while trying to edit a post" })
    });

    const searchParams = useSearchParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            type: "post",
            tags: [],
            isprivate: false,
            date: dayjs().locale('nl-be').toDate()
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (searchParams.get("edit")) {
            mutateEditPost.mutate({
                text: values.text,
                type: values.type,
                tags: values.tags.toString(),
                isprivate: values.isprivate,
                id: searchParams.get("edit")!,
                date: values.date
            })
        } else {
            mutateNewPost.mutate({
                text: values.text,
                type: values.type,
                tags: values.tags.toString(),
                isprivate: values.isprivate,
                date: values.date
            });
        }
    };

    useEffect(() => {
        if (searchParams.get("edit")) {
            const filter: Array<MyPost> = posts.filter(post => post.id.toString() === searchParams.get("edit")?.toString());
            if (filter.length > 0) {
                const selected: MyPost = filter[0];
                form.setValue("text", selected.text as string);
                form.setValue("type", selected.type);
                form.setValue("tags", !selected.tags ? [] : Array.isArray(selected.tags) ? selected.tags : (selected.tags as unknown as string).split(","));
                form.setValue("isprivate", selected.isprivate || false);
                form.setValue("date", dayjs(selected.date).toDate() || new Date());
                setIsDialogOpen(true);
            }
        }
    }, [searchParams.get("edit"), posts]);

    return (
        <div className="max-md:mx-1">
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open: boolean) => {
                    if (searchParams.get("edit") && !open) {
                        router.replace("/");
                    }
                    setIsDialogOpen(open);
                }}
            >
                <DialogTrigger asChild>
                    <Button className="px-3 py-0" >Add post</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px] lg:max-w-screen-lg overflow-y-auto max-h-screen dialog-scroll">
                    <DialogHeader>
                        <DialogTitle>New post</DialogTitle>
                    </DialogHeader>
                    <Form
                        {...form}
                    >
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                        >

                            <FormField
                                name="text"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="pb-2">
                                        <FormLabel className="required">What do you want to share:</FormLabel>
                                        <FormControl>
                                            <Textarea required  {...field} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="date"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="pb-2 relative">
                                        <FormLabel>Change the date:</FormLabel>
                                        <FormControl>
                                            <DateTimePicker value={field.value as Date} onChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="type"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="pb-2">
                                        <FormLabel >What type of post:</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                defaultValue={form.getValues("type")}
                                                onValueChange={(val: any) => field.onChange(val)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="post" id="post" />
                                                    <Label className="cursor-pointer" htmlFor="post">Post</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="event" id="event" />
                                                    <Label className="cursor-pointer" htmlFor="event">Event</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="tags"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="pb-2">
                                        <FormLabel className="block mb-1" >Add tags:</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger><p className="hover:bg-white hover:text-black border border-gray-400/40 px-2 py-1 rounded text-[14px] min-w-[200px]">See available tags {form.getValues("tags") && form.getValues("tags").length > 0 ? `(${form.getValues("tags").length})` : ""}</p></PopoverTrigger>
                                                <PopoverContent
                                                    className="max-md:w-screen"
                                                >
                                                    {
                                                        symptoms && symptoms.symptoms && symptoms.symptoms.length > 0 ? symptoms.symptoms.map((item: { label: string; value: string, description: string, id: string }, i: number) => {
                                                            return <Fragment key={i}>
                                                                <div title={item.description} className="flex items-center space-x-2 my-2 max-md:my-3">
                                                                    <Checkbox
                                                                        defaultChecked={!form.getValues("tags") ? false : form.getValues("tags").includes(item.id as string)}
                                                                        value={item.id}
                                                                        onCheckedChange={(checked) => {
                                                                            const filteredItems: Array<string> = form.getValues("tags").filter((val: any) => val !== item.id);
                                                                            if (checked) {
                                                                                field.onChange([...filteredItems, (item.id as string)]);
                                                                            } else {
                                                                                field.onChange([...filteredItems]);
                                                                            }
                                                                        }}
                                                                        id={item.id} />
                                                                    <label
                                                                        htmlFor={item.id}
                                                                        className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                    >
                                                                        {item.label}
                                                                    </label>
                                                                </div>
                                                            </Fragment>
                                                        }) : <p>No data found</p>
                                                    }
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="isprivate"
                                control={form.control}
                                render={({ field }) => (

                                    <FormItem className="pb-2">
                                        <FormLabel className="block pointer-events-none mb-1" >Private post:</FormLabel>
                                        <FormControl>
                                            <Switch onCheckedChange={field.onChange} checked={field.value} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>

                                )}
                            />
                            <Button
                                isLoading={mutateNewPost.isPending || mutateEditPost.isPending ? true : false}
                                className="min-w-24"
                                type="submit">
                                Post
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}


const formSchema = z.object({
    text: z.string().min(1, { message: "Fill this in" }),
    type: z.enum(["post", "event"]),
    tags: z.array(z.string()),
    isprivate: z.boolean(),
    date: z.date()
})