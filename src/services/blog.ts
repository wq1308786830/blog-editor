import request from '../utils/request';

const getCategories = (fatherId: number) => {
  return request.GET('/category/getCategories', { fatherId });
};

const getAllCategories = () => {
  return request.POST('/article/getAllCategories');
};

const getArticleList = (key: string) => {
  return request.GET('/article/getArticleList', { key });
};

const getArticleDetail = (articleId: string) => {
  return request.POST('/article/getArticleDetail', { articleId });
};

const getArticleRecommendLinks = (articleId: number) => {
  return request.GET('/article/getArticleRecommendLinks', { articleId });
};

const deleteCategory = (categoryId: number) => {
  return request.DELETE('/admin/deleteCategory', { categoryId });
};

export default {
  getCategories,
  getAllCategories,
  getArticleList,
  getArticleDetail,
  getArticleRecommendLinks,
  deleteCategory
};
