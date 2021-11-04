const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function fetchGenders(params) {
  const gendersResponse = await fetch(
    `${FRETTO_DOMAIN}/genders?lang=${params.language}`
  );
  const responseData = await gendersResponse.json();

  if (!gendersResponse.ok) {
    throw new Error(responseData.message || "Could not fetch genders.");
  }
 

  return  responseData.content;
}
