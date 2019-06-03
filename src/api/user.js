import http from "@/utils/http";

/**
 * 用户登录
 *
 * @export
 * @param {any} params
 * @returns
 */
export function login (params) {
  return http.post(
    '/api/sysUser/login',
    params
  )
}

/**
 * 用户信息
 *
 * @export
 * @param {any} params
 * @returns
 */
export function getInfo (params) {
  return http.post(
    '/api/sysUser/userInfo',
    params
  )
}
/**
 * 登出
 * @param {*} token
 */
export function logout (params) {
  return http.post(
    '/api/sysUser/logout',
    params
  )
}
