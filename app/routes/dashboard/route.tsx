import { DashboardSidebar } from "./ui/sidebar";
import { DashboardHeader } from "./ui/header";
import { Outlet } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
const { API } = process.env;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (API === undefined) {
    throw new Error('Missing API .env variable');
  }

  const apiRequest = await fetch(API + '/auth/me', {
    method: 'GET',
    headers: {
      'Cookie': request.headers.get('cookie') ?? ''
    }
  });

  if (apiRequest.status === 403) {
    return redirect('/login');
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {

  if (API === undefined) {
    throw new Error('Missing API .env variable');
  }

  const apiRequest = await fetch(`${API}/auth/logout`, {
    method: 'POST',
    headers: {
      'Cookie': request.headers.get('cookie') ?? ''
    },
  });

  if (apiRequest.status === 200 || apiRequest.status === 204) {
    return json({ ok: true });
  }

  const requestData = await apiRequest.json() as { message: string, code: number } | undefined;
  return json({ error: requestData?.message ?? 'unknown error happened' })
};

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader />

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}