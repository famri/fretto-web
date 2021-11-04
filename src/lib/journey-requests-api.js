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
//https://192.168.50.4:8443/wamya-backend/users/me/journey-requests?period=m6&page=0&size=25&sort=date-time,desc&lang=fr_FR
export async function loadJourneyRequests(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/users/me/journey-requests?period=${params.period}&page=${params.page}&size=${params.size}&sort=${params.sort}&lang=${params.lang}`,
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
      (data.errors && data.errors.join(", ")) ||
        "Échec du chargement des demandes de trajet."
    );
  }

  return data.content;
}
