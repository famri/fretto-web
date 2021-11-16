const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";
export async function loadProfileInfo(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/profiles/me/info?lang=${params.locale}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    }
  );

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des informations du profil.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des informations du profil."
    );
  }

  return data;
}

export async function updateAboutSection(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/profiles/me/about`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      genderId: params.genderId,
      firstname: params.firstname,
      lastname: params.lastname,
      dateOfBirth: params.dateOfBirth,
      minibio: params.minibio,
    }),
  });

  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de la mise à jour du profil.");
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de la mise à jour du profil."
    );
  }
}

export async function updateEmailSection(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/profiles/me/email`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      email: params.email,
    }),
  });

  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de la mise à jour du profil.");
    }
    if (data.errorCode === "ACCOUNT_EXISTS") {
      throw new Error(
        "Échec de la mise à jour du profil. Le nouvel email existe déjà."
      );
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de la mise à jour du profil."
    );
  }
}

export async function updateMobileSection(params) {
  const response = await fetch(`${FRETTO_DOMAIN}/profiles/me/mobile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      iccId: params.iccId,
      mobileNumber: params.mobileNumber,
    }),
  });

  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de la mise à jour du profil.");
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de la mise à jour du profil."
    );
  }
}

export async function updateProfileImage(params) {
  const formData = new FormData();
  formData.append("image", params.image);

  const response = await fetch(`${FRETTO_DOMAIN}/profiles/me/avatars`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
    body: formData,
  });

  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de la mise à jour de la photo du profil.");
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de la mise à jour de la photo du profil."
    );
  }
}
