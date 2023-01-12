export async function createUserPreference(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/user-preferences`,
    {
      method: "POST",
      body: JSON.stringify(params.userPreference),
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

  if (!response.ok) {
    try {
      data = await response.json();
      throw new Error(
        (data && data.errors && data.errors.join(", ")) ||
          "Échec de la création de préférence."
      );
    } catch (error) {
      throw new Error("Échec de la création de préférence.");
    }
  }

  return null;
}
