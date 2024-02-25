import { MyPost, postsAtom } from "@/components/pages/posts-page";
import symptoms from "@/lib/symptoms.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
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


export default function AddPost() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [posts, setPosts] = useAtom(postsAtom);
    const searchParams = useSearchParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            type: "post",
            tags: [],
            isPrivate: false
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (searchParams.get("edit")) {
            setPosts((prev) => prev.map(post => {
                if (post.id === searchParams.get("edit")) {
                    return { ...post, text: values.text, type: values.type, tags: values.tags }
                } else {
                    return post
                }
            }))
        } else {
            setPosts((prev) => [...prev, {
                date: new Date,
                text: values.text,
                type: values.type,
                tags: values.tags,
                id: uuidv4(),
                isPrivate: values.isPrivate
            }]);
        }

        setIsDialogOpen(false);
        form.reset();
        router.replace("/");
    };

    useEffect(() => {
        if (searchParams.get("edit")) {
            const filter: Array<MyPost> = posts.filter(post => post.id === searchParams.get("edit"));
            if (filter.length > 0) {
                const selected: MyPost = filter[0];
                form.setValue("text", selected.text as string);
                form.setValue("type", selected.type);
                form.setValue("tags", selected.tags);
                form.setValue("isPrivate", selected.isPrivate);
                setIsDialogOpen(true);
            }
        }
    }, [searchParams.get("edit")]);

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="px-3 py-0" >Add new post</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
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
                                                <PopoverTrigger><p className="hover:bg-white hover:text-black border border-gray-400/40 px-2 pb-1 rounded text-[14px]">See available tags {form.getValues("tags") && form.getValues("tags").length > 0 ? `(${form.getValues("tags").length})` : ""}</p></PopoverTrigger>
                                                <PopoverContent>
                                                    {
                                                        symptoms && symptoms.symptoms && symptoms.symptoms.length > 0 ? symptoms.symptoms.map((item: { label: string; value: string, description: string }, i: number) => {
                                                            return <Fragment key={i}>
                                                                <div className="flex items-center space-x-2 my-2">
                                                                    <Checkbox
                                                                        defaultChecked={form.getValues("tags").includes(item.value as string)}
                                                                        value={item.value}
                                                                        onCheckedChange={(checked) => {
                                                                            const filteredItems: Array<string> = form.getValues("tags").filter((val: any) => val !== item.value)
                                                                            console.log({
                                                                                form: form.getValues(),
                                                                                field,
                                                                                e: checked, filteredItems
                                                                            })
                                                                            if (checked) {
                                                                                field.onChange([...filteredItems, (item.value as string)]);
                                                                            } else {
                                                                                field.onChange([...filteredItems]);
                                                                            }
                                                                        }}
                                                                        id={item.value} />
                                                                    <label
                                                                        htmlFor={item.value}
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
                                name="isPrivate"
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
                            <Button className="min-w-24" type="submit">Post</Button>
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
    isPrivate: z.boolean()
})