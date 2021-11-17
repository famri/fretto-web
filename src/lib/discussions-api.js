const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

//https://192.168.50.4:8443/wamya-backend/users/me/discussions
export async function loadDiscussions(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/users/me/discussions?page=${params.page}&size=${params.size}&filter=${params.filter}&sort=${params.sort}`,
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
    throw new Error("Échec du chargement des discussions.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des discussions."
    );
  }

  return data.content;
}

//https://192.168.50.4:8443/wamya-backend/users/me/discussions/1/messages?page=0&size=25
export async function loadDiscussionMessages(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/users/me/discussions/${params.discussionId}/messages?page=${params.page}&size=${params.size}`,
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
    throw new Error("Échec du chargement des messages.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec du chargement des messages."
    );
  }

  return data;
}

//https://192.168.50.4:8443/wamya-backend/users/me/discussions/1
export async function loadDiscussion(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/users/me/discussions/${params.discussionId}`,
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
    throw new Error("Échec du chargement de la discussion.");
  }

  if (!response.ok) {
    throw new Error(
      (data &&
        ((data.errorCode === "OBJECT_NOT_FOUND" &&
          "Échec du chargement de la discussion.") ||
          (data.errors && data.errors.join(", ")))) ||
        "Échec du chargement de la discussion."
    );
  }

  return data;
}

//https://192.168.50.4:8443/wamya-backend/users/me/discussions/203/messages
export async function sendMessage(params) {
  const response = await fetch(
    `${FRETTO_DOMAIN}/users/me/discussions/${params.discussionId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({ content: params.message }),
    }
  );
  
  if (response.status === 401) {
    throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec de l'envoi du message.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors && data.errors.join(", ")) ||
        "Échec de l'envoi du message."
    );
  }

  return data.content;
}
