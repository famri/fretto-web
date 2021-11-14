const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function loadProfileInfo(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/profiles/me/info?lang=${params.locale}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    }
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des informations du profil.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des informations du profil."
    );
  }

  return data;
}
