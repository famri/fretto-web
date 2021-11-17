const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function loadJobs(params) {
  /*   const response = await fetch(
    `${FRETTO_DOMAIN}/jobs?page=${params.page}&size=${params.size}`
  );


  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des offres d'emploi.");
  }

  if (!response.ok) {
    throw new Error(
      (data && data.errors &&
        data.errors.join(", ")) ||
        "Échec du chargement des offres d'emploi."
    );
  } 
  return data.content */

  const data = {
    content: [
      {
        id: 1,
        title: "Conseiller(e) clientèle H/F",
        contract: "Temps Plein",
        location: "Télétravail",
        date: "2021-11-09",
        description:
          "Pour renforcer notre service client, nous recrutons un/une conseiller(e) clientèle. Votre mission sera",
        profile: [
          "Vous avec un niveau Bac+.",
          "Vous aimez le contact client.",
          "Vous avez le sens du service.",
          "Idéalement, vous avez une première expérience en conseil clients.",
          "Vous savez réconforter un client mécontent.",
        ],
      },
      {
        id: 2,
        title: "Chauffeur de camion H/F",
        contract: "Partenariat",
        location: "Tout le territoire",
        date: "2021-11-09",
        description:
          "Pour renforcer notre équipe de transporteurs, nous sommes à la recherche d'un chauffeur de camion.",
        profile: [
          "Vous avez un camion en bon état",
          "Vous êtes ponctuel et avez le sens du service.",
          "Vous avez une première expérience en transport terrestre.",
          "Vous souhaitez optimiser vos revenus.",
        ],
      },
      {
        id: 3,
        title: "Commercial(e) H/F",
        contract: "Temps Plein",
        location: "Nabeul. Possibilité de déplacement en journée.",
        date: "2021-11-09",
        description:
          "Pour renforcer notre présence sur le marché du fret terrestre, nous recrutons un/une commercial(e).",
        profile: [
          "Vous avez un Bac+3 en économie et gestion.",
          "Vous avez un pouvoir persuasif.",
          "Vous avez le sens des affaires.",
          "Idéalement, vous avez une première expérience en tant que commercial(e).",
        ],
      },
    ],
  };
  return data.content;
}
