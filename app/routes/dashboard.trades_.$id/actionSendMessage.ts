import apiRequestHandler from "@/functions/apiRequestHandler";

export const actionSendMessage = async (formData: FormData, request: Request) => {
  const tradeId = formData.get('tradeId');

  if (!tradeId) {
    throw new Error('Missing parameter')
  }

  return await apiRequestHandler('POST', `/admin/contracts/${tradeId.toString()}/chat`,
    {
      message: formData.get('message')
    },
    request
  );
}