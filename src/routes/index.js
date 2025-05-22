import { lazy } from "react";
import {
  Dashboard,
  Posts,
  Users,
  Contact,
  Errors,
  UserDetail,
  PostDetail,
  Settings,
  Offers,
} from "../containers";

const routes = [
  {
    path: "/",
    title: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/users",
    title: "Kullanıcılar",
    component: Users,
  },
  {
    path: "/user/:id",
    title: "UserDetail",
    component: UserDetail,
  },
  {
    path: "/posts",
    title: "İlanlar",
    component: Posts,
  },
  {
    path: "/post/:id",
    title: "PostDetail",
    component: PostDetail,
  },
  {
    path: "/contact",
    title: "İletişim",
    component: Contact,
  },
  {
    path: "/errors",
    title: "Bildiriler",
    component: Errors,
  },
  {
    path: "/settings",
    title: "Ayarlar",
    component: Settings,
  },
  {
    path: "/offers",
    title: "Teklifler",
    component: Offers,
  },
];

export default routes;
