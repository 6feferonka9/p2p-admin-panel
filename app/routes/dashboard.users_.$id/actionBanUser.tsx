import apiRequestHandler from "@/functions/apiRequestHandler";

export const actionBanUser = async (formData: FormData, request: Request) => {

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return apiRequestHandler<undefined>('POST', `/admin/auth/${formData.get('userId')}/ban`, {
    reason: formData.get('reason'),
    type: formData.get('type'),
    password: formData.get('password'),
    confirmUsername: formData.get('confirmUsername')
  },
    request
  );
} 