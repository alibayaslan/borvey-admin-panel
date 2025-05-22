import { ADMIN_LOGIN, LOG_OUT } from "../type";

export const adminLogin = (payload) => {
  return {
    type: ADMIN_LOGIN,
    payload: payload,
  };
};

export const adminLogout = (payload) => {
  return {
    type: LOG_OUT,
    payload: payload,
  };
};
