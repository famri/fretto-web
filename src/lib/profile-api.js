export async function loadProfileInfo(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/profiles/me/info?lang=${params.locale}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
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
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/profiles/me/about`,
    {
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
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
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
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/profiles/me/email`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        email: params.email,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
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
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/profiles/me/mobile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        iccId: params.iccId,
        mobileNumber: params.mobileNumber,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
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

  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/profiles/me/avatars`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
      body: formData,
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
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

export async function uploadIdentityFile(params) {
  const formData = new FormData();
  formData.append("document", params.document);

  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/users/me/identities`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
      body: formData,
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de l'envoi du document d'identité.");
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de l'envoi du document d'identité."
    );
  }
}

export async function sendEmailValidationLink(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/validation-codes/email/send?lang=${params.locale}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        email: params.email,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de l'envoi du lien de validation par email.");
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de l'envoi du lien de validation par email."
    );
  }
}

export async function sendMobileValidationCode(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/validation-codes/sms/send?lang=${params.locale}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        icc: params.icc,
        mobileNumber: params.mobileNumber,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
  let data;

  if (!response.ok) {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Échec de l'envoi du code de validation par SMS.");
    }
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de l'envoi du code de validation par SMS."
    );
  }
}

export async function validateMobileValidationCode(params) {
  const response = await fetch(
    `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/validation-codes/sms/validate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        code: params.code,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec de la validation du code.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de la validation du code."
    );
  }

  return data;
}
