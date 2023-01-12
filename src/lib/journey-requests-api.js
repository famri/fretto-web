export async function createJourneyRequest(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/journey-requests`,
    {
      method: "POST",
      body: JSON.stringify(params.journeyRequestData),
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
        (data.errors && data.errors.join(", ")) ||
          "Échec de la création de demande de trajet."
      );
    } catch (error) {
      throw new Error("Échec de la création de demande de trajet.");
    }
  }

  return null;
}

//${process.env.REACT_APP_HTTP_PROTOCOL}://192.168.50.4:8443/wamya-backend/users/me/journey-requests/62
export async function loadJourneyRequest(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/users/me/journey-requests/${params.journeyRequestId}`,
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
    throw new Error("Échec de chargement des demandes de trajet.");
  }

  if (!response.ok) {
    throw new Error(
      (data.errors && data.errors.join(", ")) ||
        "Demandes de trajet inexistante."
    );
  }

  return data;
}

//${process.env.REACT_APP_HTTP_PROTOCOL}://192.168.50.4:8443/wamya-backend/users/me/journey-requests?period=m6&page=0&size=25&sort=date-time,desc&lang=fr_FR
export async function loadJourneyRequests(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/users/me/journey-requests?period=${params.period}&page=${params.page}&size=${params.size}&sort=${params.sort}&lang=${params.lang}`,
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
    throw new Error("Échec du chargement des demandes de trajet.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des demandes de trajet."
    );
  }

  return data;
}

//${process.env.REACT_APP_HTTP_PROTOCOL}://192.168.50.4:8443/wamya-backend/journey-requests?departure=17&arrival=-1&fromDate=2021-02-01T12:00:00.342Z&toDate=2021-03-31T12:00:00.342Z&engine=1&size=5&page=0&lang=fr_FR
export async function searchJourneyRequests(params) {
  let statuses = params.statuses.join(",");
  let arrivals = params.arrivalPlaceIds.join(",");
  let engineTypes = params.engineTypeIds.join(",");

  console.log("Statuses ===> " + statuses);
  console.log("Arrivals ===> " + arrivals);
  console.log("EngineTypes ===> " + engineTypes);

  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/journey-requests?departure=${params.departurePlaceId}&arrival=${arrivals}&fromDate=${params.startDate}&toDate=${params.endDate}&engine=${params.engineTypeIds}&page=${params.page}&size=${params.size}&sort=${params.sort}&lang=${params.lang}&statuses=${statuses}`,
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
    throw new Error("Échec du chargement des demandes de trajet.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des demandes de trajet."
    );
  }

  return data;
}
