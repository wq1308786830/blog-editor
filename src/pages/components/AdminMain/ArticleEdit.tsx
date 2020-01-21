import React, { useCallback, useEffect, useState } from "react";
import { Button, Cascader, Input, Layout, message, Switch } from "antd";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import MonacoEditor from "react-monaco-editor";
import config from "../../../config";
import AdminServices from "../../../services/admin";
import BlogServices from "../../../services/blog";
import "./ArticleEdit.less";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ArticleEditState, ArticleEditProps } from "../../../models/basic";
import ReactMarkdown from 'react-markdown';

const ArticleEdit = (props: ArticleEditProps) => {
  const { categoryId, articleId } = props.match.params;
  const initState: ArticleEditState = {
    title: "",
    options: [],
    category: [],
    editor: null,
    textType: "md",
    editorState: null,
    markdownContent: "",
    articleId: parseInt(articleId, 10) + "" || "",
    categoryId: categoryId || ""
  };

  const [compState, setCompState] = useState(initState);

  /**
   * 解析文档展示
   * @param detail
   */
  const initArticle = (detail: any) => {
    if (detail.text_type === "md") {
      setCompState({ ...compState, markdownContent: detail.content });
    } else if (detail.text_type === "html") {
      initHtmlArticle(detail);
    }
    setCompState({
      ...compState,
      title: detail.title,
      textType: detail.text_type,
      category: detail.category ? Object.values(detail.category) : []
    });
  };

  const getArticleDetail = useCallback(async () => {
    const { articleId } = compState;
    if (!articleId) return;
    const resp = await BlogServices.getArticleDetail(articleId).catch(
      (err: any) => message.error(`错误：${err}`)
    );
    if (resp.success) {
      initArticle(resp.data);
    } else {
      message.warning(resp.msg);
    }
  }, [compState, initArticle]);

  const handleOptions = useCallback((data: any, optionData: any) => {
    const newOptionData = optionData;
    for (let i = 0; i < data.length; i++) {
      newOptionData[i] = { value: data[i].id, label: data[i].name };
      if (data[i].subCategory && data[i].subCategory.length) {
        handleOptions(data[i].subCategory, (newOptionData[i].children = []));
      }
    }
    return newOptionData;
  }, []);

  // get category select options data.
  useCallback(async () => {
    const resp = await BlogServices.getAllCategories().catch((err: any) => {
      message.error(`错误：${err}`);
      throw err;
    });
    if (resp.success) {
      setCompState({ ...compState, options: handleOptions(resp.data, []) });
    } else {
      message.warning(resp.msg);
    }
  }, [compState, handleOptions]);

  useEffect(() => {
    compState.editor.layout();
  }, [compState]);

  const onCascadeChange = useCallback(value => {
    setCompState({ ...compState, categoryId: value[value.length - 1] });
  }, [compState]);

  const onCascaderChange = (value: any) => {
    setCompState({ ...compState, category: value });
    onCascadeChange(value);
  };

  const onEditorStateChange = (editorState: any) => {
    setCompState({ ...compState, editorState });
  };

  const onInputChange = (e: any) => {
    setCompState({ ...compState, title: e.target.value });
  };

  const onClickPublish = () => {
    const {
      title,
      articleId,
      categoryId,
      editorState,
      textType,
      markdownContent
    } = compState;
    let content = "";
    if (textType === "md") {
      content = markdownContent;
    } else {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      content = draftToHtml(rawContent);
    }

    const body = {
      id: "",
      title,
      categoryId,
      content,
      textType
    };

    if (articleId) {
      body.id = articleId;
    }
    publish(body);
  };

  const onEditorChange = (newValue: any, e: any) => {
    window.console.log("onChange", newValue, e);
    setCompState({ ...compState, markdownContent: newValue });
  };

  const uploadImageCallBack = (file: any) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${config.Config[config.env]}/manage/uploadBlgImg`);
      xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });

  const editorDidMount = (editor: any) => {
    window.addEventListener("resize", updateDimensions);
    setCompState({ ...compState, editor });
  };

  const updateDimensions = () => {
    const { editor } = compState;
    editor.layout();
  };

  /**
   * 解析html文章展示
   * @param articleDetail
   */
  const initHtmlArticle = (articleDetail: any) => {
    const html = articleDetail ? articleDetail.content : "";
    const contentBlock = htmlToDraft(html);
    let editorState;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      editorState = EditorState.createWithContent(contentState);
      setCompState({ ...compState, editorState });
    }
  };

  const publish = async (body: any) => {
    const resp = await AdminServices.publishArticle(body);
    if (resp.success) {
      message.success("发布成功！");
    } else {
      message.warning(resp.msg);
    }
  };

  const editorChanged = (checked: boolean) => {
    setCompState({ ...compState, textType: checked ? "md" : "html" });
  };

  const {
    title,
    options,
    category,
    textType,
    editorState,
    markdownContent
  } = compState;
  const editorConfig = {
    renderSideBySide: false,
    selectOnLineNumbers: true
  };
  return (
    <Layout className="ArticleEdit">
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Input.Group compact>
          <Cascader
            value={category}
            style={{ maxWidth: 300, width: 300 }}
            options={options}
            placeholder="类目"
            onChange={onCascaderChange}
            changeOnSelect
          />
          <Input
            name="title"
            value={title}
            style={{ width: 280 }}
            placeholder="标题"
            onChange={onInputChange}
          />
        </Input.Group>
        <Button type="primary" onClick={onClickPublish}>
          是时候让大家看看神的旨意了
        </Button>
        <Switch
          checkedChildren="Markdown"
          unCheckedChildren="RichText"
          onChange={editorChanged}
          checked={textType === "md"}
        />
      </div>
      {textType === "md" ? (
        <div className="markdown-container">
          <div className="monaco-container">
            <MonacoEditor
              language="markdown"
              theme="vs-light"
              value={markdownContent}
              options={editorConfig}
              onChange={onEditorChange}
              editorDidMount={editorDidMount}
            />
          </div>
          <div className="preview-container">
            <ReactMarkdown source={markdownContent} />
          </div>
        </div>
      ) : (
        <Editor
          editorState={editorState}
          toolbarClassName="rdw-storybook-toolbar"
          wrapperClassName="rdw-storybook-wrapper"
          editorClassName="rdw-storybook-editor"
          toolbar={{
            image: {
              uploadCallback: uploadImageCallBack,
              previewImage: true
            }
          }}
          onEditorStateChange={onEditorStateChange}
        />
      )}
    </Layout>
  );
};

export default ArticleEdit;
