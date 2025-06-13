export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    userData: [],
    userFavorites: [],
    myCats: [],//añadi esto
    sentReviews: [],
    receivedReviews: [],
    searchResults: [],
    userReviewsDetails: [],
    adoptedCats: [],
    givenCatsWithAdoptant: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "set_user_data":
      return {
        ...store,
        userData: action.payload,
      };

    case "set_user_favorites":
      return {
        ...store,
        userFavorites: action.payload,
      };

    case "add_cat":
      return {
        ...store,
        myCats: action.payload,
      };
    case "set_my_cats":
      return {
        ...store,
        myCats: action.payload,
      };

    case "add_new_favorite":
      if (
        !store.userFavorites.some(
          (fav) => fav.michi_id === action.payload.michi_id
        )
      ) {
        return {
          ...store,
          userFavorites: [...store.userFavorites, action.payload],
        };
      }
      return store;

    case "remove_user_favorite":
      return {
        ...store,
        userFavorites: store.userFavorites.filter(
          (fav) => fav.michi_id !== action.payload
        ),
      };


    case "logout":
      return {
        ...store,
        userData: [],
        userFavorites: [],
        myCats: [],
        sentReviews: [],
        receivedReviews: [],
        searchResults: [],
        userReviewsDetails: [],
        adoptedCats: [],
        givenCatsWithAdoptant: [],
      };

    case "set_sent_reviews":
      return {
        ...store,
        sentReviews: action.payload,
      };

    case "set_received_reviews":
      return {
        ...store,
        receivedReviews: action.payload,
      };

    case "add_sent_review":
      return {
        ...store,
        sentReviews: [...store.sentReviews, action.payload],
      };

    case "set_search_results":
      return {
        ...store,
        searchResults: action.payload,
      };

    case "update_cat_adoptant":
      return {
        ...store,
        myCats: store.myCats.map(cat =>
          cat.cat_id !== action.payload.catId
            ? cat
            : {
              ...cat,
              contacts: cat.contacts.map(contact => ({
                ...contact,
                is_selected: contact.contactor_id === action.payload.contactorId
              }))
            }
        ),
      };


    case "set_adopted_cats":
      return {
        ...store,
        adoptedCats: action.payload,
      };

    case "set_given_cats_with_adoptant":
      return {
        ...store,
        givenCatsWithAdoptant: action.payload,
      };


    case "set_user_reviews_details":
      return {
        ...store,
        userReviewsDetails: action.payload,
      };

    default:
      console.warn("Acción desconocida:", action.type);
      return store;
  }
}
