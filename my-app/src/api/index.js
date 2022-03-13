import request from '../service/request';

/**
 * 注册账号
 */
export function registerAccount(params) {
    return request("post", '/accounts/register', params);
}

/**
 * 登录
 */
export function login(params) {
    return request("post", '/accounts/login', params);
}

/**
 * 获取用户信息
 */
export function getUserInfo(params) {
    return request("get", '/accounts/current', params);
}

/**
 * 修改密码
 */
export function changePassword(params) {
    return request("post", '/accounts/changepwd', params);
}
