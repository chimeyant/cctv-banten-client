import Vue from "vue";
import VueRouter from "vue-router";
import BaseFrontend from "../views/frontend/Base.vue";
import Auth from "../providers/AuthProviders";
import Login from "../views/frontend/Login.vue";
import RegistrasiPerusahaan from "../views/frontend/RegistrasiPerusahaan.vue";
import RegisterUser from "../views/frontend/RegisterUser.vue";
import RegistrasiBerhasil from "../views/frontend/RegistrasiBerhasil.vue";
//import Register from "../views/auth/Register.vue";
import Home from "../views/frontend/Home.vue";

//BASE APLIKASI
import Base from "../views/backend/Base.vue";

//Dashboard Page
import Dashboard from "../views/backend/pages/Dashboard.vue";

//Utiity Group Page
import User from "../views/backend/pages/utility/user/Index.vue";
import Changepwd from "../views/backend/pages/utility/user/Changepwd.vue";
import ProfilAkun from "../views/backend/pages/utility/user/Profil.vue";
import UtilityManajemenFitur from "../views/backend/pages/utility/manajemenfitur/Index.vue";
import UtilitymanajemenFiturAdministrator from "../views/backend/pages/utility/manajemenfitur/administrator/Index.vue";
import UtilityUpdateHistory from "../views/backend/pages/utility/updatehistory/Index.vue";
import UtilityUpdateHistoryItem from "../views/backend/pages/utility/updatehistory/items/Index.vue";

//page master data
import MasterAppInfo from "../views/backend/pages/masterdata/appinfo/Index.vue";
import MasterArea from "../views/backend/pages/masterdata/area/index.vue";
import MasterCCTV from "../views/backend/pages/masterdata/cctv/index.vue";

//modul pemantauan
import PemantauanCCTV from "../views/backend/pages/pemantauan/index.vue";

//Backend Halaman Depan
import HalamanDepanSlider from "../views/backend/pages/halamandepan/sliders/Index.vue";
import HalamanDepanPengumuman from "../views/backend/pages/halamandepan/pengumuman/Index.vue";
import HalamanDepanVideo from "../views/backend/pages/halamandepan/videos/Index.vue";

//Exception
import PageNotFound from "../views/backend/pages/exception/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "",
    component: BaseFrontend,
    children: [
      { path: "", redirect: { name: "home" } },
      { path: "home", name: "home", component: Home },
      {
        path: "registrasi-perusahaan",
        name: "registrasi-perusahaan",
        component: RegistrasiPerusahaan,
      },
      {
        path: "registrasi-user",
        name: "registrasi-user",
        component: RegisterUser,
      },
      {
        path: "registrasi-berhasil",
        name: "registrasi-berhasil",
        component: RegistrasiBerhasil,
      },
      { path: "login", name: "login", component: Login },

      ,
    ],
  },

  /**
   * Route Backend
   */

  {
    path: "/backend",
    name: "",
    meta: {
      auth: true,
    },
    component: Base,
    children: [
      { path: "", redirect: { name: "dashboard" } },
      { path: "dashboard", name: "dashboard", component: Dashboard },
      { path: "user", name: "user", component: User },
      {
        path: "chngpwd",
        name: "chngpwd",
        component: Changepwd,
      },
      {
        path: "profil-akun",
        name: "profil-akun",
        component: ProfilAkun,
      },
      //route master data
      {
        path: "master-app-info",
        name: "master-app-info",
        component: MasterAppInfo,
      },
      {
        path: "master-area",
        name: "master-area",
        component: MasterArea,
      },
      {
        path: "master-cctv",
        name: "master-cctv",
        component: MasterCCTV,
      },

      /**
       * Route Modul Pemantauan
       */
      {
        path: "pemantauan-cctv",
        name: "pemantauan-cctv",
        component: PemantauanCCTV,
      },

      //Route slider
      {
        path: "halaman-depan-slider",
        name: "halaman_depan_slider",
        component: HalamanDepanSlider,
      },
      //Route Pengumuman
      {
        path: "halaman-depan-pengumuman",
        name: "halaman-depan-pengumuman",
        component: HalamanDepanPengumuman,
      },
      {
        path: "halaman-depan-video",
        name: "halaman-depan-video",
        component: HalamanDepanVideo,
      },

      /**
       * Route Utility
       */
      {
        path: "utility-manajemen-fitur-administrator",
        name: "utility-manajemen-fitur-administrator",
        component: UtilitymanajemenFiturAdministrator,
      },
      {
        path: "utility-manajemen-fitur",
        name: "utility-manajemen-fitur",
        component: UtilityManajemenFitur,
      },
      {
        path: "utility-update-history",
        name: "utility-update-history",
        component: UtilityUpdateHistory,
      },
      {
        path: "utility-update-history-items/:update_history_id",
        name: "utility-update-history-items",
        component: UtilityUpdateHistoryItem,
      },
      {
        path: "*",
        name: "page-not-found",
        component: PageNotFound,
      },
    ],
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  mode: "history",
});

/**
 * router match
 */

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.auth);

  if (requiresAuth) {
    if (!Auth.check) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    if (to.name === "login" && Auth.check) {
      if (Auth.user.authent == "perusahaan") {
        next({ name: "perusahaan-dashboard" });
      } else if (Auth.user.auth === "dosen") {
        next({ name: "dosen-dashboard" });
      } else {
        next({ name: "dashboard" });
      }
    } else {
      next();
    }
  }
});

export default router;
