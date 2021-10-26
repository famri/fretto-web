const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function signup(signupData) {
  const response = await fetch(`${FRETTO_DOMAIN}/signup`, {
    method: "POST",
    body: JSON.stringify(signupData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let currentDate = new Date();
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not create account.");
  }

  return {
    token: data.access_token,
    expiryDate: currentDate.setSeconds(
      currentDate.getSeconds() + data.expires_in
    ),
  };
}

export async function signin(signinData) {
  const response = await fetch(`${FRETTO_DOMAIN}/signin`, {
    method: "POST",
    body: JSON.stringify(signinData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed.");
  }

  return {
    token: data.access_token,
    expiresInMs: data.expires_in,
  };
}
