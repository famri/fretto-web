const FRETTO_DOMAIN = "https://192.168.50.4:8443/wamya-backend";

export async function loadClientReviews(params) {
  /* const response = await fetch(
    `${FRETTO_DOMAIN}/client-reviews?page=${params.page}&size=${params.size}`
  );

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Échec du chargement des avis clients.");
  }

  if (!response.ok) {
    throw new Error(
      (data &&  data.errors &&
        data.errors.join(", ")) ||
        "Échec du chargement des avis clients."
    );
  } 
  return data.content; */

  const data = {
    content: [
      {
        id: 1,
        client: {
          name: "Foued A.",
          photoUrl:
            "https://previews.123rf.com/images/djvstock/djvstock1610/djvstock161004225/64775568-caract%C3%A8re-adolescent-gar%C3%A7on-avatar-illustration-conception.jpg",
        },
        rating: 5,
        date: "2021-09-30T14:30:00",
        content:
          "Avec Fretto ça a été simple et rapide d'avoir un bon transporteur avec un prix adorable. Je recommande!",
      },
      {
        id: 2,
        client: {
          name: "Ameni B.",
          photoUrl:
            "http://moicestnaya.com/wp-content/uploads/2018/10/getavataaarsCom.png.png",
        },
        rating: 4.0,
        date: "2021-09-30T14:30:00",
        content:
          "En 30 minutes chrono, j'ai eu le meilleur prix de la part d'un transporteur Fretto pour mon déménagement. Seul bémol, je n'ai pas pu accompagner le chauffeur dans le camion car déjà venu avec deux manutentionnaires.",
      },

      {
        id: 4,
        client: {
          name: "Ameni B.",
          photoUrl:
            "http://moicestnaya.com/wp-content/uploads/2018/10/getavataaarsCom.png.png",
        },
        rating: 4.0,
        date: "2021-09-30T14:30:00",
        content:
          "En 30 minutes chrono, j'ai eu le meilleur prix de la part d'un transporteur Fretto pour mon déménagement. Seul bémol, je n'ai pas pu accompagner le chauffeur dans le camion car déjà venu avec deux manutentionnaires.",
      },
      {
        id: 3,
        client: {
          name: "Foued A.",
          photoUrl:
            "https://previews.123rf.com/images/djvstock/djvstock1610/djvstock161004225/64775568-caract%C3%A8re-adolescent-gar%C3%A7on-avatar-illustration-conception.jpg",
        },
        rating: 5,
        date: "2021-09-30T14:30:00",
        content:
          "Avec Fretto ça a été simple et rapide d'avoir un bon transporteur avec un prix adorable. Je recommande!",
      },
      {
        id: 5,
        client: {
          name: "Foued A.",
          photoUrl:
            "https://previews.123rf.com/images/djvstock/djvstock1610/djvstock161004225/64775568-caract%C3%A8re-adolescent-gar%C3%A7on-avatar-illustration-conception.jpg",
        },
        rating: 5,
        date: "2021-09-30T14:30:00",
        content:
          "Avec Fretto ça a été simple et rapide d'avoir un bon transporteur avec un prix adorable. Je recommande!",
      },
      {
        id: 6,
        client: {
          name: "Ameni B.",
          photoUrl:
            "http://moicestnaya.com/wp-content/uploads/2018/10/getavataaarsCom.png.png",
        },
        rating: 4.0,
        date: "2021-09-30T14:30:00",
        content:
          "En 30 minutes chrono, j'ai eu le meilleur prix de la part d'un transporteur Fretto pour mon déménagement. Seul bémol, je n'ai pas pu accompagner le chauffeur dans le camion car déjà venu avec deux manutentionnaires.",
      },
    ],
  };
  return data.content;
}
