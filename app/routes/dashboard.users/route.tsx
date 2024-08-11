import { DashboardFiltering } from "./ui/filtering";
import { UsersListCard } from "./ui/card";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { PaginatedUsers } from '@p2pcoins/api-sdk'
import apiRequestHandler from "@/functions/apiRequestHandler";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const queryString = url.searchParams.toString();
  const queryObject = Object.entries(Object.fromEntries(url.searchParams)).reduce((prev, cur) => {
    return {
      ...prev,
      [cur[0]]: cur[1] === '' ? undefined : cur[1]
    }
  }, {}) as Record<string, 'string' | undefined>;


  try {
    const apiRequestData = await apiRequestHandler<PaginatedUsers>('GET', `/admin/users?${queryString}`, undefined, request);

    return {
      queryObject,
      users: {
        ...apiRequestData,
        data: apiRequestData.data.map(user => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleString('sk').split(' ').slice(0, -1).join(''),
          lastOnlineAt: new Date(user.lastOnlineAt ?? '').toLocaleString('sk').split(' ').slice(0, -1).join('')
        }))
      },
    }
  } catch (error) {
    console.error(error);

    return {
      queryObject,
      users: null,
    }
  }
};

export default function DashboardUsers() {
  const { users, queryObject } = useLoaderData<typeof loader>();

  return (
    <>
      <DashboardFiltering queryParams={queryObject} />
      <UsersListCard data={users} />
    </>
  )
}