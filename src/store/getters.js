const getters = {
  // 平台属性
  sidebar: state => state.app.sidebar, // 是否展示菜单
  device: state => state.app.device, // 设备类型
  size: state => state.app.size, // 文本大小
  // 设置属性
  showSettings: state => state.settings.showSettings, // 是否展示设置
  fixedHeader: state => state.settings.fixedHeader, // 是否固定头部
  sidebarLogo: state => state.settings.sidebarLogo, // 是否显示LOGO
  tagsView: state => state.settings.tagsView, // 是否显示tags
  theme: state => state.settings.theme, // 主题颜色
  showNavMenu: state => state.settings.showNavMenu, // 是否展示左侧菜单
  // 用户属性
  token: state => state.user.token, // 密钥
  avatar: state => state.user.avatar, // 头像
  name: state => state.user.name, // 名字
  roles: state => state.user.roles, // 角色
  // 视图
  visitedViews: state => state.tagsView.visitedViews, // 访问视图
  cachedViews: state => state.tagsView.cachedViews, // 缓存视图
  // 路由
  routes: state => state.routesPermission.routes, // 静态路由表或和动态路由表合并后的总路由表
  addRoutes: state => state.routesPermission.addRoutes // 动态添加的路由表
};
export default getters;
