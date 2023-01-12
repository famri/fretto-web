export async function fetchGenders(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/genders?lang=${params.locale}`
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
