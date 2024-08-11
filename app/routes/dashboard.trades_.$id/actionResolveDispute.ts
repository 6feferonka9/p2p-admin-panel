import apiRequestHandler from "@/functions/apiRequestHandler";

export const actionResolveDispute = async (formData: FormData, request: Request) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return await apiRequestHandler('PATCH', `/admin/contracts/${formData.get('tradeId')}/resolve-dispute`,
    {
      password: formData.get('password'),
      user: formData.get('user')
    },
    request
  );
}