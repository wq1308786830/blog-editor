import request from '../utils/request';

function getCategories(fatherId) {
  return request.GET('/category/getCategories', { fatherId });
}

function getAllCategories() {
  return request.GET('/category/getAllCategories');
}

function getArticleList(key) {
  return request.GET('/article/getArticleList', { key });
}

function getArticleDetail(articleId) {
  return request.GET('/article/getArticleDetail', { articleId });
}

function getArticleRecommendLinks(articleId) {
  return request.GET('/article/getArticleRecommendLinks', { articleId });
}

function deleteCategory(categoryId) {
  return request.DELETE('/admin/deleteCategory', { categoryId });
}

export default {
  getCategories,
  getAllCategories,
  getArticleList,
  getArticleDetail,
  getArticleRecommendLinks,
  deleteCategory
};
