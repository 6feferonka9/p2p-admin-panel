import apiRequestHandler from "@/functions/apiRequestHandler";

export const actionCancelTrade = async (formData: FormData, request: Request) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return await apiRequestHandler('PATCH', `/admin/contracts/${formData.get('tradeId')}/cancel`, {
    password: formData.get('password'),
  },
    request
  );
}