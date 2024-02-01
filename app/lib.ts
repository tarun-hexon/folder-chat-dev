export async function requestEmailVerification(email: string) {
  return await fetch("https://danswer-dev.folder.chat/api/auth/request-verify-token", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  });
}
