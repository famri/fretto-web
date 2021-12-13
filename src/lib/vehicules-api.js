const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function loadTransporterVehicules(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/users/me/vehicules?&sort=${params.sort}&lang=${params.lang}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des véhicules.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des véhicules."
    );
  }

  return data.content;
}