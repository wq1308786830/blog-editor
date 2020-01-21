import { message } from "antd";

/**
 * 展示loading
 * @param isShow 是否展示
 * @param afterClose 关闭后的执行函数
 * @param content loading下的文案
 */
const loading = (
  isShow = true,
  content = "正在加载...",
  afterClose: any = undefined
) => {
  if (isShow) {
    message.loading(content, 300, afterClose);
  } else {
    message.destroy();

    if (afterClose !== undefined) {
      afterClose();
    }
  }
};

/**
 * 展示toast
 * @param afterClose 关闭后的执行函数
 * @param content toast文案
 */
const toast = (content: string, afterClose: any = undefined) => {
  message.info(content, 2, afterClose);
};

/**
 * 将请求参数转换为application/x-www-form-urlencoded的参数形式
 * @param {Object} obj 请求参数
 * @return {string}
 */
const parseObj2SearchParams = (obj: any) => {
  let searchParams = "";
  if (obj !== null && obj !== undefined) {
    searchParams = Object.keys(obj)
      .map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      })
      .join("&");
  }

  return searchParams;
};

export default { loading, toast, parseObj2SearchParams };
