const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
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

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec de chargement des devis.");
  }

  if (!response.ok) {
    throw new Error(
      (data &&
        data.errorCode &&
        data.errorCode === "OBJECT_NOT_FOUND" &&
        "La demande de trajet est inexistante.") ||
        (data.errors && data.errors.join(", ")) ||
        "Échec de chargement des devis."
    );
  }

  return data.content;
}

export async function updateProposalStatus(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/journey-requests/${params.journeyId}/proposals/${params.proposalId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({ status: params.status }),
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
        (data &&
          data.errorCode &&
          data.errorCode === "OBJECT_NOT_FOUND" &&
          "La demande de trajet est inexistante.") ||
          (data && data.errors && data.errors.join(", ")) ||
          "Échec de changement de statut de l'offre."
      );
    } catch (error) {
      throw new Error("Échec de changement de statut de l'offre.");
    }
  }

  return null;
}
