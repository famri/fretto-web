const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function addQuoteRequestUnauthenticated(quoteData) {
  const response = await fetch(`${FIREBASE_DOMAIN}/quote-requests`, {
    method: "POST",
    body: JSON.stringify(quoteData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not create a quote request");
  }

  return null;
}
