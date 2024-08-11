import apiRequestHandler from "@/functions/apiRequestHandler";

export const actionImportReviews = async (formData: FormData, request: Request) => {

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return apiRequestHandler<undefined>('POST', `/admin/users/${formData.get('userId')}/transfer-reputation`, {
    score: Number.parseFloat(formData.get('score') as string),
    reviewCount: Number.parseInt(formData.get('reviewCount') as string, 10),
    tradesCount: Number.parseInt(formData.get('tradesCount') as string, 10),
    source: formData.get('source'),
    userId: formData.get('userId'),
    password: formData.get('password')
  },
    request
  )
}
