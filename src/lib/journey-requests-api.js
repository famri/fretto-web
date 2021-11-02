const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function createJourneyRequest(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/journey-requests`, {
    method: "POST",
    body: JSON.stringify(params.journeyRequestData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      data.message || "Échec de la création de demande de trajet."
    );
  }

  return null;
}
