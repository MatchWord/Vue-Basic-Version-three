import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 引入静态路由表
import { constantRouterMap } from "./routes/staticRoutes.js";
// 暂时引入动态路由表（此时无用户权限之分）
// import { aysncRoutesMap } from "./routes/aysncRoutes.js"
// const  constantRouter = constantRouterMap.concat(aysncRoutesMap)
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
