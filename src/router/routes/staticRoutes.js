import Layout from "@/views/Layout";

/**
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
  //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
  hidden: true // (默认 false)

  //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
  redirect: 'noRedirect'

  //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
  //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
  //若你想不管路由下面的 children 声明的个数都显示你的根路由
  //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
  alwaysShow: true
  name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
  meta: {
    roles: ['admin', 'editor'] //设置该路由进入的权限，支持多个权限叠加
    title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name' //设置该路由的图标
    noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
    affix: true                  如果设置为true，则标签将粘贴在“标签”视图中。
  }
 */
/*
 * 公共路由表, 一般情况这里无需任何修改.
 * 除非你需要配置更多任何角色或权限下都可以访问的路由
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: "",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "iconfont icon-shouye1", affix: true }
      }
    ]
  }
];