import { DashboardFiltering } from "./ui/filtering";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
const { API } = process.env;
import { PaginatedAdminContracts } from '@p2pcoins/api-sdk'
import { TradesListCard } from "./ui/card";
import apiRequestHandler from "@/functions/apiRequestHandler";

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

  try {
    const apiRequestData = await apiRequestHandler<PaginatedAdminContracts>('GET', `/admin/contracts?${queryString}`, undefined, request);

    return {
      queryObject,
      trades: {
        ...apiRequestData,
        data: apiRequestData.data.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString('sk').split(' ').slice(0, -1).join('')
        }))
      }
    }
  } catch (error) {
    console.error(error);

    return {
      queryObject,
      trades: null,
    }
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