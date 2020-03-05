import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Cascader,
  DatePicker,
  Input,
  List,
  message,
  Popconfirm,
  Spin
} from 'antd';
import './ArticleListManage.less';
import AdminServices from '../../../services/admin';
import BlogServices from '../../../services/blog';

interface ArticleListProps {}

interface Options {
  categoryId: string;
  dateRange: any[];
  text: string;
}

interface ArticleListState {
  loading: boolean;
  loadingMore: boolean;
  showLoadingMore: boolean;
  category: string[];
  data: any[];
  pageIndex: number;
  options: Object[];
  cOptions: Options;
}

const ArticleListManage = (props: ArticleListProps) => {
  const initState: ArticleListState = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    category: [],
    data: [],
    pageIndex: 0,
    options: [],
    cOptions: {
      categoryId: '',
      dateRange: [],
      text: ''
    }
  };
  const [compState, setCompState] = useState(initState);

  // get category select options data.
  const getAllCategories = async () => {
    const resp = await BlogServices.getAllCategories().catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      setCompState({ ...compState, options: handleOptions(resp.data, []) });
    } else {
      message.warning(resp.msg);
    }
  };

  useEffect(() => {
    let { cOptions, pageIndex, data } = compState;
    getAllCategories();
    getArticlesData(cOptions, pageIndex, (res: any) => {
      if (res.length < 2) {
        setCompState({ ...compState, showLoadingMore: false });
      }
      setCompState({ ...compState, loading: false, data: res });
    });

    getArticlesData(cOptions, pageIndex, (res: any) => {
      if (res.length < 2) {
        setCompState({
          ...compState,
          pageIndex: --pageIndex,
          showLoadingMore: false
        });
      }
      const moreData = data.concat(res);
      setCompState({ ...compState, loadingMore: false, data: moreData });
      // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      // In real scene, you can using public method of react-virtualized:
      // eslint-disable-next-line max-len
      // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
      window.dispatchEvent(new Event('resize'));
    });
  }, [compState, getAllCategories]);

  const onCascaderChange = (value: any) => {
    const { cOptions } = compState;
    changeSelectState();
    setCompState({ ...compState, category: value });
    setCompState({
      ...compState,
      cOptions: { ...cOptions, categoryId: value[value.length - 1] }
    });
  };

  const onRangePickerChange = (dates: any) => {
    const { cOptions } = compState;
    changeSelectState();
    setCompState({
      ...compState,
      cOptions: {
        ...cOptions,
        dateRange: [dates[0].unix(), dates[1].unix()]
      }
    });
  };

  const onInputChange = (e: any) => {
    e.persist();
    const { cOptions } = compState;
    changeSelectState();
    setCompState({
      ...compState,
      cOptions: { ...cOptions, text: e.target.value }
    });
  };

  /**
   *  get articles by conditions in data `option` and page number pageIndex.
   *  callback function will deal response data.
   */
  const getArticlesData = async (
    option: any,
    pageIndex: number,
    callback: any
  ) => {
    const resp = await AdminServices.getArticles(option, pageIndex).catch(
      (err: any) => message.error(`错误：${err}`)
    );
    if (resp.success) {
      callback(resp.data);
    } else {
      callback([]);
    }
  };

  const onSearchClick = () => {
    const { cOptions, pageIndex } = compState;
    getArticlesData(cOptions, pageIndex, (res: any) => {
      if (res.length < 2) {
        setCompState({ ...compState, showLoadingMore: false });
      }
      setCompState({
        ...compState,
        showLoadingMore: true,
        loading: false,
        data: res
      });
    });
  };

  // handle load more button click event.
  const onLoadMore = () => {
    let { pageIndex } = compState;
    setCompState({ ...compState, loadingMore: true });
    setCompState({ ...compState, pageIndex: ++pageIndex });
  };

  // change pageIndex number and needSelect status when selected condition changes.
  const changeSelectState = () => {
    const { pageIndex } = compState;
    if (pageIndex > 0) {
      setCompState({ ...compState, pageIndex: 0 });
    }
  };

  const confirm = async (article: any) => {
    const { data } = compState;
    const resp = await AdminServices.deleteArticle(article.id).catch(
      (err: any) => message.error(`错误：${err}`)
    );
    if (resp.success) {
      const deletedItem = data.filter(item => item.id !== article.id);
      setCompState({ ...compState, data: deletedItem });
      message.success(`博文${article.title}，删除成功！`);
    }
  };

  /**
   * The recursive function to change option's key name.
   * @param data:input option array data.
   * @param optionData:output option array data.
   * @returns optionData: output option array data.
   */
  const handleOptions = (data: any, optionData: any) => {
    const newOptionData = optionData;
    for (let i = 0; i < data.length; i++) {
      newOptionData[i] = { value: data[i].id, label: data[i].name };
      if (data[i].subCategory && data[i].subCategory.length) {
        handleOptions(data[i].subCategory, (newOptionData[i].children = []));
      }
    }
    return optionData;
  };

  const {
    loading,
    loadingMore,
    showLoadingMore,
    data,
    options,
    category,
    cOptions
  } = compState;
  const loadMore = showLoadingMore ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px'
      }}
    >
      {loadingMore && <Spin />}
      {!loadingMore && data.length ? (
        <Button onClick={onLoadMore}>加载更多</Button>
      ) : null}
    </div>
  ) : (
    <div className='ant-list-empty-text'>没更多数据了</div>
  );
  return (
    <div>
      <Input.Group
        compact={true}
        style={{ textAlign: 'center', paddingBottom: '2em' }}
      >
        <Cascader
          value={category}
          style={{ width: 300 }}
          options={options}
          placeholder='类目'
          onChange={onCascaderChange}
          changeOnSelect={true}
        />
        <DatePicker.RangePicker
          name='dateRange'
          value={cOptions.dateRange}
          onChange={onRangePickerChange}
          placeholder={['开始时间', '截止时间']}
        />
        <Input
          name='text'
          value={cOptions.text}
          placeholder='模糊搜索'
          onChange={onInputChange}
          style={{ width: 200 }}
        />
        <Button type='primary' icon='search' onClick={onSearchClick}>
          过滤
        </Button>
      </Input.Group>
      <List
        className='demo-loadmore-list'
        loading={loading}
        itemLayout='horizontal'
        loadMore={loadMore}
        dataSource={data}
        renderItem={item => (
          <List.Item
            actions={[
              <Link
                to={{
                  state: { articleDetail: item, category, options },
                  pathname: `/admin/articleEdit/${item.category_id}/${item.id}`
                }}
              >
                编辑
              </Link>,
              <Popconfirm
                title='确定要删除吗?'
                onConfirm={() => confirm(item)}
                okText='确定'
                cancelText='取消'
              >
                <Button>删除</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
              }
              title={
                <Link
                  to={`/category/${item.category_id}/articles/${item.id}/detail`}
                  target='_blank'
                >
                  {item.title}
                </Link>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ArticleListManage;
