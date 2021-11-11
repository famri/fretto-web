const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function sendUserContactForm(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/user-messages`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;

  if (!response.ok) {
    try {
      data = await response.json();
      throw new Error(
        (data && data.errors && data.errors.join(", ")) ||
          "Échec de l'envoi de votre message."
      );
    } catch (error) {
      throw new Error("Échec de l'envoi de votre message.");
    }
  }

  return null;
}
