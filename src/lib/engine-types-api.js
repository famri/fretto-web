const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function fetchEngineTypes(params) {
  const engineTypesResponse = await fetch(
    `${FRETTO_DOMAIN}/engine-types?lang=${params.language}`
  );
  const responseData = await engineTypesResponse.json();

  if (!engineTypesResponse.ok) {
    throw new Error(responseData.message || "Could not fetch engine types.");
  }

  return responseData["content"];
}
