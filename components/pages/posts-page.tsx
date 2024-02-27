import symptoms from "@/lib/symptoms.json";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Event } from "../ui/event";
import { Post, PostProps } from "../ui/post";
import { isLoggedInAtom } from "@/lib/states";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import dayjs from "dayjs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HelpCircle } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
const PageLayout = dynamic(() => import("@/components/layouts/page-layout"), { ssr: false });

export const postsAtom = atom<MyPost[]>([]);

export default function PostsPage() {
    const [posts, setPosts] = useAtom(postsAtom);
    const [isLoggedIn, _] = useAtom(isLoggedInAtom);
    const router = useRouter();

    const { isLoading, isError, refetch } = useQuery({
        queryKey: ["getPosts"],
        queryFn: () => fetch("/api/posts").then(res => res.json()).then(postsData => {
            if (postsData) setPosts(postsData);
            return postsData
        }),
        refetchOnWindowFocus: false,
        retry: false,
        enabled: true,
        staleTime: 0
    });

    const mutateDeletePost = useDeletePost({ refetch });

    function onDelete(id: string) {
        mutateDeletePost.mutate(id);
    }
    function onEdit(id: string) {
        router.replace("/?edit=" + id);
    }

    return <>
        <PageLayout className={`mb-20`}>
            {
                isLoading ? <div className="flex flex-col justify-center items-center gap-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div> : isError ? <h1 className="text-center text-xl my-10">Error: Something went wrong trying to fetch the posts</h1> :
                    posts && posts.length > 0 && isLoggedIn ?
                        // Perform the following operations if conditions are met
                        Object.entries(
                            // Sort the 'posts' array based on the 'date' property in descending order
                            posts.sort((a: MyPost, b: MyPost) => a.date > b.date ? -1 : 1)
                                // Use 'reduce' to group the posts by month
                                .reduce((acc: { [key: string]: MyPost[] }, post) => {
                                    if (isLoggedIn !== "admin" && post.isprivate) return acc
                                    // Group the posts by their month using 'dayjs' library
                                    const groupedDate = dayjs(new Date(post.date)).format("MMMM 'YY");
                                    // If the grouped date already exists in the accumulator, append the post to the existing array, otherwise create a new array
                                    acc[groupedDate] = acc[groupedDate] ? [...acc[groupedDate], post] : [post];
                                    return acc;
                                }, {})
                        )
                            // Map through the entries (grouped dates and posts in that month)
                            .map(([groupedDate, postsInMonth], i) =>
                                // Render each grouped month with its posts
                                <div key={i}>
                                    <h1 className="lg:text-center mb-4 max-lg:text-2xl text-3xl font-bold">{groupedDate.charAt(0).toUpperCase() + groupedDate.slice(1)}</h1>
                                    {
                                        // Map through the posts in the current month
                                        (postsInMonth as any).map((post: MyPost, i: number) =>
                                            // Check if the post is private and the user is logged in as "user"; if true, render null, otherwise render the post or event
                                            <Fragment key={i}>
                                                <div className="mb-7 max-lg:mb-10 relative">
                                                    {
                                                        post.type === "event" ?
                                                            <Event className="mb-3" onEdit={onEdit} onDelete={onDelete} key={i} {...post} isprivate={post.isprivate} /> :
                                                            <Post className="mb-3" onEdit={onEdit} onDelete={onDelete} key={i} {...post} isprivate={post.isprivate} />
                                                    }
                                                    <div className="flex flex-row flex-wrap gap-1.5 mx-2">
                                                        {
                                                            // Map through the tags of the current post and render badges with tooltips
                                                            post.tags && (post.tags as unknown as string).split(",").map((tag: string, i: number) => {
                                                                // Find tag data from 'symptoms' based on the tag value
                                                                const tagData = symptoms.symptoms.filter(symptom => symptom.value === tag).length > 0 ?
                                                                    symptoms.symptoms.filter(symptom => symptom.value === tag)[0] :
                                                                    symptoms.symptoms.filter(symptom => symptom.id === tag).length > 0 ?
                                                                        symptoms.symptoms.filter(symptom => symptom.id === tag)[0] :
                                                                        undefined;
                                                                // If tag data is not found, return null, otherwise render a tooltip with badge
                                                                if (!tagData) return null;
                                                                return <Fragment key={i}>
                                                                    <Popover>
                                                                        <PopoverTrigger className="max-md:hidden">
                                                                            <Badge variant="secondary" className="pointer" key={i}>
                                                                                {tagData?.label.toLowerCase() || tag}
                                                                            </Badge>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="md:min-w-[500px]">
                                                                            <p className="font-bold  block text-lg mb-2">{tagData.label}</p>
                                                                            <p className="mb-3">{tagData.description}</p>
                                                                            {
                                                                                tagData.solution && <>
                                                                                    <p className="font-bold mb-1">
                                                                                        <HelpCircle size={18} className="inline-block mr-1" />
                                                                                        Help:
                                                                                    </p>
                                                                                    <p >{tagData.solution}</p>
                                                                                </>
                                                                            }

                                                                        </PopoverContent>
                                                                    </Popover>
                                                                    <Drawer>
                                                                        <DrawerTrigger className="hidden max-md:inline-block">
                                                                            <Badge variant="secondary" className="pointer" key={i}>
                                                                                {tagData?.label.toLowerCase() || tag}
                                                                            </Badge>
                                                                        </DrawerTrigger>
                                                                        <DrawerContent className="pb-7">
                                                                            <DrawerHeader>
                                                                                <DrawerTitle className="text-2xl mb-2">{tagData.label || tag}</DrawerTitle>
                                                                                <DrawerDescription>{tagData.description}</DrawerDescription>
                                                                            </DrawerHeader>

                                                                            {
                                                                                tagData.solution && <div className="m-4">
                                                                                    <p className="font-bold  mb-1">
                                                                                        <HelpCircle size={18} className="inline-block mr-1" />
                                                                                        Help:
                                                                                    </p>
                                                                                    <p className="text-gray-300">{tagData.solution}</p>
                                                                                </div>
                                                                            }
                                                                        </DrawerContent>
                                                                    </Drawer>
                                                                </Fragment>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                </div>
                            ) : <h1 className="text-center text-xl my-10">There are no posts yet.</h1>

            }
        </PageLayout>
    </>;
}


export interface MyPost extends Omit<PostProps, "onDelete" | "onEdit"> {
    tags: string[];
    type: "post" | "event";
    isprivate: boolean;
}

export const useDeletePost = ({ refetch }: { refetch: () => void }) => useMutation({
    mutationKey: ["deletePost"],
    mutationFn: (id: string) => fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({ id })
    }),
    onSettled: () => {
        refetch();
    },
    retry: false,
})