import axios from "axios";
import config from "../config";
import tools from "./tools";

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

const { prefix } = config;
const TIMEOUT = 3 * 60 * 1000; // 请求超时3min

axios.defaults.baseURL = prefix;
axios.defaults.timeout = TIMEOUT;
axios.defaults.headers.common.Authorization = "111";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

/**
 * 请求后端返回Promise
 *
 * @param  {string} url       请求api
 * @param  {object} [options] fetch需要的options配置
 * @param  {boolean} [isShowLoading] 是否展示loading
 * @return {Promise}          返回数据，Promise或者undefined
 */
async function request(url: string, options: any, isShowLoading: boolean) {
  if (isShowLoading) {
    tools.loading(true);
  }

  let response;
  const option = {
    url,
    method: options.method,
    data: options.body
  };
  try {
    response = await axios(option);
  } catch (e) {
    tools.loading(false, undefined, () => {
      if (e.errMessage) {
        return tools.toast(e.errMessage);
      }
      return tools.toast("网络错误～");
    });
    throw e;
  }

  if (isShowLoading) {
    tools.loading(false);
  }
  return response;
}

/**
 * 请求发送前的全局处理
 */
axios.interceptors.request.use(
  conf => {
    return conf;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 请求返回的全局处理
 */
axios.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response);
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * GET请求，注意请求参数直接缀到url地址
 * @param url 请求的url
 * @param {Object} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<void>} 返回结果
 * @constructor
 */
function GET(url: string, params: any = null, showLoading: boolean = false) {
  let searchParams = tools.parseObj2SearchParams(params);
  searchParams = searchParams === "" ? searchParams : `?${searchParams}`;

  const options = {
    method: "GET"
  };

  return request(`${url}${searchParams}`, options, showLoading);
}

/**
 * POST请求
 * @param url 请求的url
 * @param {Object} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<void>} 返回结果
 * @constructor
 */
function POST(url: string, params: any = null, showLoading: boolean = false) {
  const searchParams = tools.parseObj2SearchParams(params);

  const options = {
    method: "POST",
    body: searchParams
  };

  return request(url, options, showLoading);
}

/**
 * PUT请求
 * @param url 请求的url
 * @param {Object} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<void>} 返回结果
 * @constructor
 */
function PUT(url: string, params: any = null, showLoading: boolean = false) {
  const searchParams = tools.parseObj2SearchParams(params);

  const options = {
    method: "PUT",
    body: searchParams
  };

  return request(url, options, showLoading);
}

/**
 * DELETE请求
 * @param url 请求的url
 * @param {Object} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<void>} 返回结果
 * @constructor
 */
function DELETE(url: string, params: any = null, showLoading: boolean = false) {
  let searchParams = tools.parseObj2SearchParams(params);
  searchParams = searchParams === "" ? searchParams : `?${searchParams}`;

  const options = {
    method: "DELETE"
  };
  return request(`${url}${searchParams}`, options, showLoading);
}

export default {
  GET,
  POST,
  PUT,
  DELETE
};
