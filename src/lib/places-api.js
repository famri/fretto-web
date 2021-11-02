const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function fetchSuggestions(params) {
  const suggestionsResponse = await fetch(
    `${FRETTO_DOMAIN}/places?lang=${params.language}&input=${params.text}&country=${params.country}`
  );
  const responseData = await suggestionsResponse.json();

  if (!suggestionsResponse.ok) {
    throw new Error(responseData.message || "Could not fetch suggestions.");
  }

  return responseData["content"];
}
