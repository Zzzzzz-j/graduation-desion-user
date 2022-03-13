/**
 * 网络请求配置
 */
import axios from 'axios';
import { message } from 'antd';

import { BASE_URL, TIMEOUT } from './config';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        "Content-Type": 'application/json',
    }
})

/**
 * http request 拦截器
 */
instance.interceptors.request.use(config => {
    if (sessionStorage.token) {
        config.headers.Authorization = sessionStorage.token
    }
    return config
}, error => {
    return Promise.reject(error);
})

/**
 * http response 拦截器
 */
instance.interceptors.response.use(res => {
    return res.data
}, error => {
    console.log('error',error);
    message.error(error.response.data);

    const { status } = error.response;
    if (status == 401) {
        message.error('token值无效，请重新登录');
        // 清除token
        localStorage.removeItem('token');

        // 页面跳转
        window.location.hash = '/login';
    }
    return Promise.reject(error);
})

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance.get(url, {
            params: params,
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data) {
    return new Promise((resolve, reject) => {
        instance.post(url, data).then(
            (response) => {
                //关闭进度条
                resolve(response);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

//统一接口处理，返回数据
export default function (fecth, url, param) {
    let _data = "";
    return new Promise((resolve, reject) => {
        switch (fecth) {
            case "get":
                console.log("begin a get request,and url:", url);
                get(url, param)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (error) {
                        console.log("get request GET failed.", error);
                        reject(error);
                    });
                break;
            case "post":
                post(url, param)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (error) {
                        console.log("get request POST failed.", error);
                        reject(error);
                    });
                break;
            default:
                break;
        }
    });
}

// export default instance;
