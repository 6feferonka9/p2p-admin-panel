import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { AdminContractDetail, ChatMessageSender } from '@p2pcoins/api-sdk';
import { styled } from "@linaria/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { actionSendMessage } from "./actionSendMessage";
import { actionResolveDispute } from "./actionResolveDispute";
import { actionCancelTrade } from "./actionCancelTrade";
import apiRequestHandler from "@/functions/apiRequestHandler";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    const apiRequestData = await apiRequestHandler<AdminContractDetail>('GET', `/admin/contracts/${params.id ?? ''}`, undefined, request);

    return json({
      trade: apiRequestData
    })
  } catch (error) {
    console.error(error);

    return json({
      trade: null,
    })
  }

};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formAction = formData.get('formAction') as null | 'SEND_MESSAGE' | 'CANCEL_TRADE' | 'RESOLVE_DISPUTE';

  try {
    await (async () => {
      switch (formAction) {
        case 'SEND_MESSAGE': {
          return await actionSendMessage(formData, request);
        }
        case 'CANCEL_TRADE': {
          return await actionCancelTrade(formData, request);
        }
        case 'RESOLVE_DISPUTE': {
          return await actionResolveDispute(formData, request);
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

const DataWrapper = styled.div`
  max-width: 100%;
  font-size: 12px;
`;

const getChatBubbleStyling = (sender: ChatMessageSender) => {
  switch (sender) {
    case 'buyer': {
      return 'bg-blue-200 self-end w-[100%]'
    }
    case 'seller': {
      return 'bg-slate-300 w-[100%]'
    }
    case 'admin': {
      return 'bg-red-400 w-[100%]'
    }
  }
}

export default function DashboardSingleUser() {
  const { trade } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData && ('error' in actionData)) {
      toast(actionData.error);
    }

    if (actionData && ('ok' in actionData) && actionData.ok) {
      toast('Action successfull');

      if (actionData.ok === 'SEND_MESSAGE') {
        const el: HTMLFormElement | null = document.querySelector(`#chat-form`);
        if (el) { el.reset(); }
      }
    }
  }, [actionData]);

  const getChatUsername = (sender: ChatMessageSender) => {
    switch (sender) {
      case 'buyer': {
        return trade?.buyerUsername
      }
      case 'seller': {
        return trade?.sellerUsername
      }
      case 'admin': {
        return 'Support'
      }
    }
  }

  return (
    <>
      <Separator />
      {trade && (
        <>
          <div className="flex gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default">Chat</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chat messages</SheetTitle>
                  <div className="grid gap-4">
                    <div style={{ overflowY: 'auto' }} className="max-w-xl p-2 max-h-96 flex gap-1.5 rounded-md border flex-col-reverse">
                      <div className="flex flex-col">
                        {trade.chatMessages.map((message, i) => (
                          <Card className={`p-2 my-1 flex flex-col ${getChatBubbleStyling(message.sender)} `} style={{ maxWidth: '90%' }} key={i.toString()}>
                            <span className="text-xs font-bold">{getChatUsername(message.sender)}</span>
                            <span className="text-xs">{message.message}</span>
                            {message.fileUrl && <Link target="_blank" reloadDocument to={`/api/image?url=${message.fileUrl}`}><span className="text-xs" style={{ color: 'red' }}>Image</span></Link>}
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Form id="chat-form" className="flex max-w-xl gap-2" method="POST">
                      <Input className="h-9" type="text" placeholder="Message" name="message" />
                      <Button type="submit" name="formAction" value="SEND_MESSAGE">Send</Button>
                      <Input type="hidden" name="tradeId" value={trade.id} />
                    </Form>
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Popover>
              <PopoverTrigger asChild>
                <Button id="SEND_MESSAGE_BUTTON" variant="destructive">Cancel trade</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Form className="grid gap-4" method="POST">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" id="password" type="password" required />
                  </div>
                  <Button type="submit" name="formAction" value="CANCEL_TRADE">Submit</Button>
                  <Input type="hidden" name="tradeId" value={trade.id} />
                </Form>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button id="RESOLVE_DISPUTE_BUTTON" variant="default" disabled={trade.status !== "disputed"}>Resolve dispute</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Form method="POST" className="grid gap-4">
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="user">In favor of</Label>
                    <Select defaultValue={undefined} name="user">
                      <SelectTrigger className="">
                        <SelectValue placeholder="User" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer ({trade.buyerUsername})</SelectItem>
                        <SelectItem value="seller">Seller ({trade.sellerUsername})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" id="password" type="password" required />
                  </div>
                  <Button type="submit" name="formAction" value="RESOLVE_DISPUTE">Submit</Button>
                  <Input type="hidden" name="tradeId" value={trade.id} />
                </Form>
              </PopoverContent>
            </Popover>
          </div>

          <Separator></Separator>

          <DataWrapper>
            <pre>{JSON.stringify({ ...trade, chatMessages: 'hidden' }, null, 2)}</pre>
          </DataWrapper>
        </>
      )}
    </>
  )
}