import { DashboardFiltering } from "./ui/filtering";
import { UsersListCard } from "./ui/card";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
const { API } = process.env;
import { PaginatedUsers } from '@p2pcoins/api-sdk'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (API === undefined) {
    throw new Error('Missing API .env variable');
  }

  const url = new URL(request.url);
  const queryString = url.searchParams.toString();
  const queryObject = Object.entries(Object.fromEntries(url.searchParams)).reduce((prev, cur) => {
    return {
      ...prev,
      [cur[0]]: cur[1] === '' ? undefined : cur[1]
    }
  }, {}) as Record<string, 'string' | undefined>;

  const apiRequest = await fetch(`${API}/admin/users?${queryString}`, {
    method: 'GET',
    headers: {
      'Cookie': request.headers.get('cookie') ?? ''
    }
  });

  if (apiRequest.status === 200) {
    const apiData = await apiRequest.json() as PaginatedUsers;

    return {
      queryObject,
      users: {
        ...apiData,
        data: apiData.data.map(user => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleString('sk').split(' ').slice(0, -1).join(''),
          lastOnlineAt: new Date(user.lastOnlineAt ?? '').toLocaleString('sk').split(' ').slice(0, -1).join('')
        }))
      },
    }
  }

  return {
    queryObject,
    users: null,
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