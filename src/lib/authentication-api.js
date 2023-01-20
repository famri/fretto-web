const WAMYA_BACKEND = "wamya-backend";
const OAUTH_BACKEND = "oauth";

export async function signup(signupParams) {
  const signupResponse = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/${WAMYA_BACKEND}/accounts?lang=fr_FR`,
    {
      method: "POST",
      body: JSON.stringify(signupParams),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let signupResponseData;
  try {
    signupResponseData = await signupResponse.json();
  } catch (error) {
    throw new Error(
      "Échec de l'inscription. Veuillez réessayer plus tard ou contacter le support si le problème persiste."
    );
  }

  if (!signupResponse.ok) {
    if (
      signupResponseData &&
      signupResponseData.errorCode === "ACCOUNT_EXISTS"
    ) {
      throw new Error(
        (signupResponseData.errors && signupResponseData.errors.join(", ")) ||
          "Votre adresse email ou téléphone existe déja. Veuillez vous connecter."
      );
    } else {
      throw new Error(
        (signupResponseData.errors && signupResponseData.errors.join(", ")) ||
          "Échec de l'inscription. Veuillez réessayer plus tard ou contacter le support si le problème persiste."
      );
    }
  }

  const token = signupResponseData.access_token;

  const checkTokenResponse = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/${OAUTH_BACKEND}/userinfo`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let checkTokenData;
  try {
    checkTokenData = await checkTokenResponse.json();
  } catch (error) {
    throw new Error(
      "Échec de la validation du token. Veuillez réessayer ou contacter le support si le problème persiste."
    );
  }

  if (!checkTokenResponse.ok) {
    throw new Error(
      (checkTokenData &&
        checkTokenData.errors &&
        checkTokenData.errors.join(", ")) ||
        "Échec de la validation du token. Veuillez réessayer ou contacter le support si le problème persiste."
    );
  }

  return {
    token: signupResponseData.access_token,
    expiresInSec: signupResponseData.expires_in,
    sub: checkTokenData.email,
    oauthId: checkTokenData.sub,
    isClient: checkTokenData.roles.includes("CLIENT"),
  };
}

export async function signin(signinData) {
  const signinResponse = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/${WAMYA_BACKEND}/login`,
    {
      method: "POST",
      body: JSON.stringify(signinData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let signinResponseData;
  try {
    signinResponseData = await signinResponse.json();
  } catch (error) {
    throw new Error("Échec de la connexion. Login ou mot de passe incorrect.");
  }

  if (!signinResponse.ok) {
    throw new Error(
      (signinResponseData &&
        ((signinResponseData.errorCode === "AUTHORIZATION" &&
          "Échec de la connexion. Login ou mot de passe incorrect.") ||
          (signinResponseData.errors &&
            signinResponseData.errors.join(", ")))) ||
        "Échec de la connexion. Login ou mot de passe incorrect."
    );
  }

  const token = signinResponseData.access_token;

  const checkTokenResponse = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/${OAUTH_BACKEND}/userinfo`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  let checkTokenData;
  try {
    checkTokenData = await checkTokenResponse.json();
  } catch (error) {
    throw new Error("Échec de la connexion. Login ou mot de passe incorrect.");
  }

  if (!checkTokenResponse.ok) {
    throw new Error(
      (checkTokenData &&
        checkTokenData.errors &&
        checkTokenData.errors.join(", ")) ||
        "Échec de la validation du toekn. Veuillez réessayer ou contacter le support si le problème persiste."
    );
  }

  return {
    token: signinResponseData.access_token,
    expiresInSec: signinResponseData.expires_in,
    sub: checkTokenData.email,
    oauthId: checkTokenData.sub,
    isClient: checkTokenData.roles.includes("CLIENT"),
  };
}
