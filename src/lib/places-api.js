const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function fetchSuggestions(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/places?lang=${params.language}&input=${params.text}&country=${params.country}`
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des suggestions.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des suggestions."
    );
  }

  return data.content;
}
