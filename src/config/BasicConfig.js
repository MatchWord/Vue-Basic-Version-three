/**
 * BASE URL 访问接口的路径
 */
const baseUrl = {
  dev: 'http://dydzgj.16bus.net:9090',
  prod: 'http://dydzgj.16bus.net:9090'
}
//
export const BASE_PER_FIX_URL = process.env.NODE_ENV === 'production' ? baseUrl.prod : baseUrl.dev

/**
  * 路由表默认参数配置
  */
export const ROUTER_DEFAULT_CONFIG = {
  isUseStaticeRouter: true
}

/**
  *是否调用接口
  */
export const USE_API = {
  isUseApi: false
}