const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function fetchEngineTypes(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/engine-types?lang=${params.language}`
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
