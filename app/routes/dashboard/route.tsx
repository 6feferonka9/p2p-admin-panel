import { DashboardSidebar } from "./ui/sidebar";
import { DashboardHeader } from "./ui/header";
import { Outlet } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import apiRequestHandler from "@/functions/apiRequestHandler";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    await apiRequestHandler('GET', '/auth/me', undefined, request);

    return null;
  } catch (error) {
    console.error(error);
    return redirect('/login');
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {

  try {
    await apiRequestHandler('POST', `/auth/logout`, undefined, request);
    json({ ok: true })
  } catch (error) {
    console.error(error);
    return json({ error } as { error: string })
  }
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