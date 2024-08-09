export const actionResolveDispute = async (API: string, formData: FormData, cookie: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return await fetch(`${API}/admin/contracts/${formData.get('tradeId')}/resolve-dispute`, {
    method: 'PATCH',
    body: JSON.stringify({
      password: formData.get('password'),
      user: formData.get('user')
    }),
    headers: {
      "Content-Type": "application/json",
      'Cookie': cookie
    },
  });
}