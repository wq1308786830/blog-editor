import md5 from 'md5';
import request from '../utils/request';

const login = (formData: any) => {
  const params = {
    ...formData,
    password: md5(formData.password)
  };
  return request.POST('/admin/login', params);
};

const getArticles = (option: any, pageIndex: number) => {
  const params = { ...option, pageIndex };
  return request.GET(`/admin/getArticles`, params);
};

const publishArticle = (body: any) => {
  return request.POST('/article/publishArticle', { ...body });
};

const deleteArticle = (id: string) => {
  return request.GET('/article/deleteArticle', { id });
};

const addCategory = (fatherId: number, level: number, categoryName: string) => {
  return request.PUT('/admin/addCategory', { fatherId, level, categoryName });
};

export default {
  login,
  getArticles,
  publishArticle,
  deleteArticle,
  addCategory
};
