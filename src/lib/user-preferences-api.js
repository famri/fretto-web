const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function createUserPreference(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/user-preferences`, {
    method: "POST",
    body: JSON.stringify(params.userPreference),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Échec de la création de préférence.");
  }

  return null;
}
