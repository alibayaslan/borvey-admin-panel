import { ADMIN_LOGIN, LOG_OUT } from "../type";

const initialState = {
  user: {
    token: "",
  },
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case ADMIN_LOGIN:
      return {
        ...action.payload.data,
        token: action.payload.token,
      };
    case LOG_OUT:
      return {
        user: {
          token: "",
        },
      };
    default:
      return state;
  }
}
