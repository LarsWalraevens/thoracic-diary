import { zodResolver } from "@hookform/resolvers/zod";
import cookie from "cookie";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { isLoggedInAtom } from "@/lib/states";
import dynamic from "next/dynamic";
const PageLayout = dynamic(() => import("@/components/layouts/page-layout"), { ssr: false });

export default function LoginPage() {
    const [_, setIsLoggedIn] = useAtom(isLoggedInAtom);
    const cookies = cookie.parse(document.cookie);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    });
    function handleLoginState(password: string) {
        var isValidPass = false;
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setIsLoggedIn("admin");
            isValidPass = true;
        } else if (password === process.env.NEXT_PUBLIC_USER_PASSWORD) {
            setIsLoggedIn("user");
            isValidPass = true;
        }

        if (isValidPass) document.cookie = cookie.serialize("userSecret", password, { path: "/", secure: true, maxAge: 60 * 60 * 24 * 30 });
        else form.setError("password", { message: "Invalid password" });
    }

    useEffect(() => {
        if (cookies.userSecret) {
            handleLoginState(cookies.userSecret);
        }
    }, [cookies.userSecret]);

    function onSubmitLogin(values: z.infer<typeof formSchema>) {
        handleLoginState(values.password)
    }

    return <>
        <PageLayout>
            <section className="flex justify-center items-center mt-[17vh]">
                <Card className="lg:max-w-[700px] lg:w-[500px] w-full max-lg:border-none max-md:[&_>*]:px-0">
                    <CardHeader>
                        <CardTitle className="mb-2">Log in</CardTitle>
                        <CardDescription>Please login with a valid password to gain access</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...form}
                        >
                            <form
                                onSubmit={form.handleSubmit(onSubmitLogin)}
                            >

                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="pb-2">
                                            <FormLabel className="required" >Fill in the password:</FormLabel>
                                            <FormControl>
                                                <Input required type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Login</Button>
                            </form>
                        </Form>
                    </CardContent>
                    {/* <CardFooter>
                <p></p>
            </CardFooter> */}
                </Card>
            </section >
        </PageLayout>


    </>
}

const formSchema = z.object({
    password: z.string().min(3, { message: "Fill this in" }),
})