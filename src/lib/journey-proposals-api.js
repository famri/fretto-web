const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
//https://192.168.50.4:8443/wamya-backend/journey-requests/62/proposals?lang=fr_FR&filter=status:submitted,accepted,rejected
export async function loadJourneyProposals(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/journey-requests/${params.journeyId}/proposals?filter=${params.filter}&lang=${params.lang}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.errorCode &&
        data.errorCode === "OBJECT_NOT_FOUND" &&
        "La demande de trajet est inexistante.") ||
        (data.errors && data.errors.join(", ")) ||
        "Échec de chargement des devis."
    );
  }

  return data.content;
}
