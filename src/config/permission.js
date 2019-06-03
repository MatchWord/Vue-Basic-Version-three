import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条插件
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置文件

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getinfo获取了权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // note: 角色必须是对象数组！例如：【管理员】或，【开发人员】、【编辑人员】 ['admin'] or ,['developer','editor']
          // 获取角色
          const { roles } = await store.dispatch('user/getInfo')
          console.log(roles)
          // 基于角色生成可访问的路由映射
          const accessRoutes = await store.dispatch('routesPermission/generateRoutes', roles)
          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)

          //hack方法确保addroutes完成
          //设置replace:true，导航不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next('/login')
          NProgress.done()
        }
      }
    }
  } else {
    /* 无token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面。
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
//  结束进度条
  NProgress.done()
})
