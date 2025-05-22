export const ApiRoutes = {
  auth: {
    login: "/auth/login-admin",
  },
  user: {
    getList: "/admin/get-user-list",
    get: "/admin/get-user",
    edit: "/admin/edit-user",
    editFirm: "/admin/edit-firm",
    changeStatus: "/admin/change-user-status",
  },
  post: {
    getList: "/admin/get-post-list",
    get: "/admin/get-post",
    edit: "/admin/edit-post",
    change: "/admin/change-post",
  },
  offer: {
    getList: "/admin/get-offer-list",
  },
  contact: {
    getList: "/admin/get-contact",
  },
  report: {
    getList: "/admin/get-report",
  },
  dashboard: {
    get: "/admin/get-dashboard",
  },
  setting: {
    update: "/admin/update-settings",
    get: "/admin/get-settings",
  },
};
