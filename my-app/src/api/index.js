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

/**
 * 贷款申请
 */
 export function postLoanApply(params) {
    return request("post", '/accounts/loan/application', params);
}

/**
 * 保存身份信息
 */
 export function postUserInfo(params) {
    return request("post", '/accounts/user/info', params);
}

/**
 * 获取用户身份信息
 */
 export function getUserDetails(params) {
    return request("get", '/accounts/details', params);
}
