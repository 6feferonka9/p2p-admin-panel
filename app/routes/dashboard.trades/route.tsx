import { DashboardFiltering } from "./ui/filtering";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
const { API } = process.env;
import { PaginatedAdminContracts } from '@p2pcoins/api-sdk'
import { TradesListCard } from "./ui/card";

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

  const apiRequest = await fetch(`${API}/admin/contracts?${queryString}`, {
    method: 'GET',
    headers: {
      'Cookie': request.headers.get('cookie') ?? ''
    }
  });

  if (apiRequest.status === 200) {
    const apiData = await apiRequest.json() as PaginatedAdminContracts;

    return {
      queryObject,
      trades: {
        ...apiData,
        data: apiData.data.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString('sk').split(' ').slice(0, -1).join('')
        }))
      }
    }
  }

  return {
    queryObject,
    trades: null,
  }
};

export default function DashboardUsers() {
  const { trades, queryObject } = useLoaderData<typeof loader>();

  return (
    <>
      <DashboardFiltering queryParams={queryObject} />
      <TradesListCard data={trades} />
    </>
  )
}