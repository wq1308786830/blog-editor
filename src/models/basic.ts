export interface Rates {
  currency: string;
  rate: string;
}

export interface ArticleEditProps {
  match: any;
  title: string;
  options: any;
  category: any;
  textType: string;
  editorState: any;
  markdownContent: any
}

export interface ArticleEditState {
  articleId: string;
  categoryId: string;
  title: string;
  options: any;
  category: any;
  textType: string;
  editorState: any;
  editor: any;
  markdownContent: any
}
