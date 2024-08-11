const API = process.env.API;

export default async function apiRequestHandler<ReturnType>(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', endpoint: string, body?: Record<string, unknown>, req?: Request, successCallback?: (res: Response) => void) {
  if (!API) {
    throw new Error('API ENV is not defined');
  }

  const cookies = req?.headers.get('cookie');

  const response = await fetch(`${API}${endpoint}`, {
    headers: {
      'content-type': 'application/json',
      'Cookie': cookies ?? '',
    },
    method,
    body: JSON.stringify(body)
  });

  if (response.status === 200 || response.status === 204) {
    if (successCallback) {
      successCallback(response);
    }

    return await response.json() as ReturnType;
  } else {
    const errorData = await response.json() as { message?: string, code: number };
    throw new Error(errorData.message ?? 'Unknown error happened')
  }
}