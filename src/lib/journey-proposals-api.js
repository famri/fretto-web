export async function loadJourneyProposals(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/journey-requests/${params.journeyId}/proposals?filter=${params.filter}&lang=${params.lang}`,
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
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/journey-requests/${params.journeyId}/proposals/${params.proposalId}`,
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

export async function sendProposal(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/journey-requests/${params.journeyId}/proposals?lang=${params.lang}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        price: params.price,
        vehiculeId: params.vehiculeId,
      }),
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
          "Échec de l'envoi de votre devis."
      );
    } catch (error) {
      throw new Error("Échec de l'envoi de votre devis.");
    }
  }

  return null;
}

export async function loadTransporterProposals(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/users/me/proposals?lang=${params.lang}&page=${params.page}&size=${params.size}&sort=${params.sort}&period=${params.period}&statuses=${params.statuses}`,
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

  return data;
}
