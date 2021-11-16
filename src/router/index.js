import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../components/Dashboard.vue";
import PrintAssestment from "../components/PrintAssestment.vue";
import Login from "../views/Login.vue";
import Auth from "../views/Auth.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
    component: Auth,
    children: [
      {
        name: "login",
        path: "/login",
        component: Login
      }
    ]
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: Home,
    children: [
      {
        name: "dashboard",
        path: "/dashboard",
        component: Dashboard
      },
      {
        name: "print-assestment",
        path: "/print-assestment",
        component: PrintAssestment
      },
    ]
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: Login,
  // },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
