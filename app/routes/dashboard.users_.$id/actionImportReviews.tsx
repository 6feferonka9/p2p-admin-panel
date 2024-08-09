export const actionImportReviews = async (API: string, formData: FormData, cookie: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return await fetch(`${API}/admin/users/${formData.get('userId')}/transfer-reputation`, {
    method: 'POST',
    body: JSON.stringify({
      score: Number.parseFloat(formData.get('score') as string),
      reviewCount: Number.parseInt(formData.get('reviewCount') as string, 10),
      tradesCount: Number.parseInt(formData.get('tradesCount') as string, 10),
      source: formData.get('source'),
      userId: formData.get('userId'),
      password: formData.get('password')
    }),
    headers: {
      "Content-Type": "application/json",
      'Cookie': cookie
    },
  });
}
