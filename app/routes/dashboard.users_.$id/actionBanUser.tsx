export const actionBanUser = async (API: string, formData: FormData, cookie: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return await fetch(`${API}/admin/auth/${formData.get('userId')}/ban`, {
    method: 'POST',
    body: JSON.stringify({
      reason: formData.get('reason'),
      type: formData.get('type'),
      password: formData.get('password'),
      confirmUsername: formData.get('confirmUsername')
    }),
    headers: {
      "Content-Type": "application/json",
      'Cookie': cookie
    },
  });
}