export async function requestPasswordReset(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/accounts/do-request-password-reset?lang=${params.locale}`,
    {
      method: "POST",
      body: JSON.stringify({ username: params.username }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data;

  if (!response.ok) {
    try {
      data = await response.json();
      throw new Error(
        (data && data.errors && data.errors.join(", ")) ||
          "Échec de la réinitialisation du mot de passe."
      );
    } catch (error) {
      throw new Error("Échec de la réinitialisation du mot de passe.");
    }
  }

  return null;
}
