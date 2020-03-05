import React, {useCallback, useEffect, useState} from 'react';
import {Button, Cascader, Input, Layout, message, Switch} from 'antd';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import MonacoEditor from 'react-monaco-editor';
import config from '../../../config';
import AdminServices from '../../../services/admin';
import BlogServices from '../../../services/blog';
import './ArticleEdit.less';
import ReactMarkdown from 'react-markdown';
import {ArticleEditProps} from '../../../models/basic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const ArticleEdit = (props: ArticleEditProps) => {
    const {categoryId, articleId} = props.match.params;
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState([]);
    const [category, setCategory] = useState([]);
    const [editor, setEditor] = useState<any | null>(null);
    const [textType, setTextType] = useState('md');
    const [editorState, setEditorState] = useState<any | null>(null);
    const [markdownContent, setMarkdownContent] = useState('');
    const [cateId, setCateId] = useState(categoryId || '');

    /**
     * 解析文档展示
     * @param detail
     */
    const initArticle = (detail: any) => {
        if (detail.text_type === 'md') {
            setMarkdownContent(detail.content);
        } else if (detail.text_type === 'html') {
            initHtmlArticle(detail);
        }
        setTitle(detail.title);
        setTextType(detail.text_type);
        setCategory(detail.category ? Object.values(detail.category) : []);
    };

    const handleOptions = useCallback((data: any, optionData: any) => {
        const newOptionData = optionData;
        for (let i = 0; i < data.length; i++) {
            newOptionData[i] = {value: data[i].id, label: data[i].name};
            if (data[i].subCategory && data[i].subCategory.length) {
                handleOptions(data[i].subCategory, (newOptionData[i].children = []));
            }
        }
        return newOptionData;
    }, []);

    // get category select options data.
    const getAllCategories = async () => {
        const resp = await BlogServices.getAllCategories().catch((err: any) => {
            message.error(`错误：${err}`);
            throw err;
        });
        if (resp.success) {
            setOptions(handleOptions(resp.data, []));
        } else {
            message.warning(resp.msg);
        }
    };

    const getArticleDetail = async () => {
        const aId = parseInt(articleId, 10) + '' || '';
        if (!aId) return;
        const resp = await BlogServices.getArticleDetail(aId).catch((err: any) =>
            message.error(`错误：${err}`)
        );
        if (resp.success) {
            initArticle(resp.data);
        } else {
            message.warning(resp.msg);
        }
    };

    const onCascadeChange = useCallback(value => {
        setCateId(value[value.length - 1]);
    }, []);

    useEffect(() => {
        const categories = getAllCategories();
        const detail = getArticleDetail();
        window.console.log(categories, detail);
    }, []);

    const onCascaderChange = (value: any) => {
        setCategory(value);
        onCascadeChange(value);
    };

    const onEditorStateChange = (eState: any) => {
        setEditorState(eState);
    };

    const onInputChange = (e: any) => {
        setTitle(e.target.value);
    };

    const onClickPublish = () => {
        let content = '';
        if (textType === 'md') {
            content = markdownContent;
        } else {
            const rawContent = editorState && convertToRaw(editorState.getCurrentContent());
            content = rawContent && draftToHtml(rawContent);
        }

        const body = {
            id: '',
            title,
            cateId,
            content,
            textType
        };

        if (articleId) {
            body.id = parseInt(articleId, 10) + '' || '';
        }
        publish(body);
    };

    const onEditorChange = (newValue: any, e: any) => {
        window.console.log('onChange', newValue, e);
        setMarkdownContent(newValue);
    };

    const uploadImageCallBack = (file: any) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${config.Config[config.env]}/manage/uploadBlgImg`);
            xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        });

    const editorDidMount = (e: any) => {
        window.addEventListener('resize', updateDimensions);
        setEditor(e);
    };

    const updateDimensions = () => {
        editor.layout();
    };

    /**
     * 解析html文章展示
     * @param articleDetail
     */
    const initHtmlArticle = (articleDetail: any) => {
        const html = articleDetail ? articleDetail.content : '';
        const contentBlock = htmlToDraft(html);
        let editState;
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            editState = EditorState.createWithContent(contentState);
            setEditorState(editState);
        }
    };

    const publish = async (body: any) => {
        const resp = await AdminServices.publishArticle(body);
        if (resp.success) {
            message.success('发布成功！');
        } else {
            message.warning(resp.msg);
        }
    };

    const editorChanged = (checked: boolean) => {
        setTextType(checked ? 'md' : 'html')
    };

    const editorConfig = {
        renderSideBySide: false,
        selectOnLineNumbers: true
    };

    const style = {
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between'
    };
    return (
        <Layout className='ArticleEdit'>
            <div
                style={style}
            >
                <Input.Group compact={true}>
                    <Cascader
                        value={category}
                        style={{maxWidth: 300, width: 300}}
                        options={options}
                        placeholder='类目'
                        onChange={onCascaderChange}
                        changeOnSelect={true}
                    />
                    <Input
                        name='title'
                        value={title}
                        style={{width: 280}}
                        placeholder='标题'
                        onChange={onInputChange}
                    />
                </Input.Group>
                <Button type='primary' onClick={onClickPublish}>
                    是时候让大家看看神的旨意了
                </Button>
                <Switch
                    checkedChildren='Markdown'
                    unCheckedChildren='RichText'
                    onChange={editorChanged}
                    checked={textType === 'md'}
                />
            </div>
            {textType === 'md' ? (
                <div className='markdown-container'>
                    <div className='monaco-container'>
                        <MonacoEditor
                            language='markdown'
                            theme='vs-light'
                            value={markdownContent}
                            options={editorConfig}
                            onChange={onEditorChange}
                            editorDidMount={editorDidMount}
                        />
                    </div>
                    <div className='preview-container'>
                        <ReactMarkdown source={markdownContent}/>
                    </div>
                </div>
            ) : (
                <Editor
                    editorState={editorState}
                    toolbarClassName='rdw-storybook-toolbar'
                    wrapperClassName='rdw-storybook-wrapper'
                    editorClassName='rdw-storybook-editor'
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
