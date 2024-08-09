export const actionCancelTrade = async (API: string, formData: FormData, cookie: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return await fetch(`${API}/admin/contracts/${formData.get('tradeId')}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({
      password: formData.get('password'),
    }),
    headers: {
      "Content-Type": "application/json",
      'Cookie': cookie
    },
  });
}