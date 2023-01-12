export async function fetchEngineTypes(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/engine-types?lang=${params.language}`
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Echec du chargement des types de véhicule.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Echec du chargement des types de véhicule."
    );
  }

  return data.content;
}
