const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function fetchGenders(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/genders?lang=${params.locale}`
  );

  
  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des genres.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des genres."
    );
  }

  return data.content;
}
