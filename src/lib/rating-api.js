const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function fetchTransporterRatingRequest(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/rating-details?h=${params.hash}&uid=${params.uid}&lang=fr_FR`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des informations.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des informations."
    );
  }

  return data;
}
//params: uid, hash, comment, rating
export async function sendTransporterRating(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/ratings?lang=fr_FR`, {
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
          "Échec de l'envoi de l'avis client."
      );
    } catch (error) {
      throw new Error("Échec de l'envoi de l'avis client.");
    }
  }

  return null;
}
