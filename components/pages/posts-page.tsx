import symptoms from "@/lib/symptoms.json";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Badge } from "../ui/badge";
import { Event } from "../ui/event";
import { Post, PostProps } from "../ui/post";
import { isLoggedInAtom } from "@/lib/states";
import dynamic from "next/dynamic";
const PageLayout = dynamic(() => import("@/components/layouts/page-layout"), { ssr: false });

export const postsAtom = atom<MyPost[]>([]);

export default function PostsPage() {
    const [posts, setPosts] = useAtom(postsAtom);
    const [isLoggedIn, _] = useAtom(isLoggedInAtom);
    const router = useRouter();

    function onDelete(id: string) {
        setPosts(posts.filter(post => post.id !== id));
    }
    function onEdit(id: string) {
        router.replace("/?edit=" + id);
    }

    return <>
        <PageLayout>
            {
                posts && posts.length > 0 && isLoggedIn ? posts.map((post, i) => post.isPrivate && isLoggedIn === "user" ? null : <Fragment key={i}>
                    <div className="mb-5 relative">
                        {
                            post.type === "event" ? <Event className="mb-2" onEdit={onEdit} onDelete={onDelete} key={i} {...post} /> :
                                <Post className="mb-2" onEdit={onEdit} onDelete={onDelete} key={i} {...post} />
                        }
                        <div className="flex flex-row flex-wrap gap-1">
                            {
                                post.tags.map((tag: string, i: number) => {
                                    const tagData = symptoms.symptoms.filter(symptom => symptom.value === tag).length > 0 ? symptoms.symptoms.filter(symptom => symptom.value === tag)[0] : undefined;
                                    return <Badge
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
    isPrivate: boolean;
}