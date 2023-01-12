export async function fetchSuggestions(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/places?lang=${params.language}&input=${params.text}&country=${params.country}`
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des suggestions.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des suggestions."
    );
  }

  return data.content;
}

export async function fetchDepartments(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/departments?lang=${params.language}&input=${params.text}&country=${params.country}`
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des départements.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des départements."
    );
  }

  return data.content;
}
