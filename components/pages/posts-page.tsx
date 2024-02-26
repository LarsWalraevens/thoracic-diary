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
        <PageLayout>
            {
                isLoading ? <div className="flex flex-col justify-center items-center gap-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div> : isError ? <h1 className="text-center text-xl my-10">Error: Something went wrong trying to fetch the posts</h1> :
                    posts && posts.length > 0 && isLoggedIn ? posts.sort((a: any, b: any) => a.date > b.date ? -1 : 1).map((post, i) => post.isprivate && isLoggedIn === "user" ? null : <Fragment key={i}>
                        <div className="mb-5 relative">
                            {
                                post.type === "event" ? <Event className="mb-2" onEdit={onEdit} onDelete={onDelete} key={i} {...post} isprivate={post.isprivate} /> :
                                    <Post className="mb-2" onEdit={onEdit} onDelete={onDelete} key={i} {...post} isprivate={post.isprivate} />
                            }
                            <div className="flex flex-row flex-wrap gap-1">
                                {
                                    post.tags && (post.tags as unknown as string).split(",").map((tag: string, i: number) => {
                                        const tagData = symptoms.symptoms.filter(symptom => symptom.value === tag).length > 0 ? symptoms.symptoms.filter(symptom => symptom.value === tag)[0] : undefined;
                                        return <Badge
                                            variant="secondary"
                                            title={(tagData && tagData.description) || undefined}
                                            key={i}>
                                            {tagData?.label.toLowerCase() || tag}
                                        </Badge>
                                    })
                                }
                            </div>

                        </div>
                    </Fragment>) : <h1 className="text-center text-xl my-10">There are no posts yet.</h1>

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