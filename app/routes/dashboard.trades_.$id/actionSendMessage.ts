export const actionSendMessage = async (API: string, formData: FormData, cookie: string) => {
  const tradeId = formData.get('tradeId');

  if (!tradeId) {
    throw new Error('Missing parameter')
  }

  return await fetch(`${API}/admin/contracts/${tradeId.toString()}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      message: formData.get('message')
    }),
    headers: {
      "Content-Type": "application/json",
      'Cookie': cookie
    },
  });
}