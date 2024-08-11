import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { toast } from "sonner"
import { useEffect } from "react";
import apiRequestHandler from "@/functions/apiRequestHandler";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const bodyData = {
    userType: 'admin',
    email: formData.get('email'),
    password: formData.get('password')
  }

  try {
    await apiRequestHandler('POST', '/auth/login', bodyData, undefined, (res) => {
      return redirect('/dashboard/users', {
        headers: [
          ["Set-Cookie", res.headers.getAll('set-cookie')[0]],
          ["Set-Cookie", res.headers.getAll('set-cookie')[1]]
        ],
      });
    });
  } catch (error) {
    return json({ error } as { error: string })
  }
};

export default function LoginPage() {
  const loginActionData = useActionData<typeof action>();
  const navigation = useNavigation();

  useEffect(() => {
    if (loginActionData && ('error' in loginActionData)) {
      toast(loginActionData.error)
    }
  }, [loginActionData]);

  return (
    <Form method="POST" key="login-form" id="login-form">
      <Card className="w-full max-w-sm my-0 mx-auto mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">{navigation.state === 'idle' ? 'Sign in' : 'Submiting...'}</Button>
        </CardFooter>
      </Card>
    </Form>
  )
}
