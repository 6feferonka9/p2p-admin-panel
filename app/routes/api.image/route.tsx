import { LoaderFunctionArgs } from "@remix-run/node";
const { API } = process.env;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url).searchParams.get('url') ?? '';
  const API_WITHOUT_FIRST_PART = API?.split('/').toSpliced(-2).join('/') ?? '';

  if (API === undefined) {
    throw new Error('Missing API .env variable');
  }

  const apiRequest = await fetch(`${API_WITHOUT_FIRST_PART}${url}`, {
    method: 'GET',
    headers: {
      'Cookie': request.headers.get('cookie') ?? ''
    }
  });

  return apiRequest;
}