import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { AdminViewUserDetail } from '@p2pcoins/api-sdk';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { actionImportReviews } from "./actionImportReviews";
import { actionBanUser } from "./actionBanUser";
import apiRequestHandler from "@/functions/apiRequestHandler";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    const apiRequestData = await apiRequestHandler<AdminViewUserDetail>('GET', `/admin/users/${params.id ?? ''}`, undefined, request);

    return json({
      user: apiRequestData
    })
  } catch (error) {
    console.error(error);

    return json({
      user: null,
    })
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formAction = formData.get('formAction') as null | 'REPUTATION' | 'BAN';

  try {
    await (async () => {
      switch (formAction) {
        case 'REPUTATION': {
          await actionImportReviews(formData, request);
          break;
        }
        case 'BAN': {
          await actionBanUser(formData, request);
          break;
        }

        default: {
          throw new Error('Did not match formAction');
        }
      }
    })();

    return json({ ok: formAction });
  } catch (error) {
    return json({ error } as { error: string })
  }
};

export default function DashboardSingleUser() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  useEffect(() => {
    if (actionData && ('error' in actionData)) {
      toast(actionData.error);
    }

    if (actionData && ('ok' in actionData) && actionData.ok) {
      toast('Action successfull');
      const el: null | HTMLButtonElement = document.querySelector(`#${actionData.ok}_BUTTON`);
      if (el) {
        el.click();
      }
    }
  }, [actionData]);

  return (
    <>
      <Separator />

      {user && (
        <>
          <div id="aa" className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" id="REPUTATION_BUTTON">Transfer reputation</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Form method="POST">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="score">Score</Label>
                      <Input id="score" max={5} min={1} step={0.1} type="number" name="score" placeholder="4.6" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reviewCount">Review count</Label>
                      <Input name="reviewCount" id="reviewCount" placeholder="200" type="number" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tradesCount">Trades count</Label>
                      <Input name="tradesCount" id="tradesCount" placeholder="200" type="number" required />
                    </div>
                    <div className="grid gap-2">
                      <Select defaultValue={undefined} name="source">
                        <SelectTrigger>
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hodl Hodl">Hodl Hodl</SelectItem>
                          <SelectItem value="LocalCoinSwap">LocalCoinSwap</SelectItem>
                          <SelectItem value="Binance">Binance</SelectItem>
                          <SelectItem value="Paxful">Paxful</SelectItem>
                          <SelectItem value="Coinbase">Coinbase</SelectItem>
                          <SelectItem value="Bybit">Bybit</SelectItem>
                          <SelectItem value="Bisq">Bisq</SelectItem>
                          <SelectItem value="LocalBitcoins">LocalBitcoins</SelectItem>
                          <SelectItem value="Uniswap">Uniswap</SelectItem>
                          <SelectItem value="AgoraDesk">AgoraDesk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input name="password" id="password" type="password" required />
                    </div>
                    <Button type="submit" name="formAction" value="REPUTATION">{navigation.state === 'idle' ? 'Submit' : 'Submiting...'}</Button>
                  </div>
                  <Input type="hidden" name="userId" value={user.id} />
                </Form>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="destructive" id="BAN_BUTTON">Ban user</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Form method="POST">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" type="text" name="confirmUsername" placeholder="Confirm username" required />
                    </div>
                    <div className="grid gap-2">
                      <Select defaultValue={undefined} name="type">
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soft">Soft</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input name="reason" id="reason" type="text" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input name="password" id="password" type="password" required />
                    </div>
                    <Input type="hidden" name="userId" value={user.id} />
                    <Button variant="destructive" name="formAction" type="submit" value="BAN">{navigation.state === 'idle' ? 'Submit' : 'Submiting...'}</Button>
                  </div>
                </Form>
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          <div className="max-w-full text-xs">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </>
      )}
    </>
  )
}