import React, { useEffect, useState } from 'react';
import { Button, message, Select } from 'antd';
import CategoryModal from './CategoryModal';
import BlogServices from '../../../services/blog';
import './CategoryManage.less';

const { Option } = Select;

interface CategoryProps {}

interface CategoryState {
  curId: number[];
  children1: any[];
  children2: any[];
  children3: any[];
  categoryData: any[];
}

const CategoryManage = (props: CategoryProps) => {
  let categoryTemp: any[]; // category cache data.
  const initState: CategoryState = {
    curId: [],
    children1: [],
    children2: [],
    children3: [],
    categoryData: []
  };

  const [compState, setCompState] = useState(initState);
  const [modal, setModal] = useState({ visible: false, categoryName: '' });

  useEffect(() => {
    getAllCategories();
  });

  /**
   * get next level children in data by `id`.
   * @param id
   * @param data
   */
  const getChildren = (id: string, data: any) => {
    if (!data || !data.length) {
      return;
    }
    data.map((item: any) => {
      if (item.id === parseInt(id, 10)) {
        categoryTemp = item.subCategory;
      } else {
        return getChildren(id, item.subCategory);
      }
      return categoryTemp;
    });
  };

  // get all categories data in json string.
  const getAllCategories = () => {
    BlogServices.getAllCategories()
      .then((data: any) => {
        if (data.success) {
          let children = data.data.map((item: any) => (
            <Option key={item.id}>{item.name}</Option>
          ));
          setCompState({
            ...compState,
            children1: children,
            categoryData: data.data
          });
          children = null;
        } else {
          message.warning(data.msg);
        }
      })
      .catch((e: any) => message.error(`错误：${e}`));
  };

  const handleChange1 = (value: any) => {
    const { curId } = compState;
    const children: any[] = handleChangeInner(value);
    setCompState({ ...compState, children2: children });
    if (parseInt(value, 10)) {
      curId.splice(
        0 /* start position */,
        curId.length /* delete count */,
        value /* insert value */
      );
      setCompState({ ...compState, curId });
    } else {
      // set first `curId` item as a default value `0` when `value` equals `0`.
      setCompState({ ...compState, curId: [0] });
    }
  };

  const handleChange2 = (value: any) => {
    const { curId } = compState;
    const children = handleChangeInner(value);
    setCompState({ ...compState, children3: children });
    if (parseInt(value, 10)) {
      curId.splice(1, curId.length - 1, value);
      setCompState({ ...compState, curId });
    } else {
      // push the last item of `curId` array as a new item into
      // `curId` when `value` param equals `0`.
      setCompState({
        ...compState,
        curId: curId.concat(curId[curId.length - 1])
      });
    }
  };

  const handleChange3 = (value: any) => {
    const { curId } = compState;
    if (parseInt(value, 10)) {
      setCompState({ ...compState, curId: value });
      curId.splice(2, curId.length - 2, value);
      setCompState({ ...compState, curId });
    } else {
      // push the last item of `curId` array as a new item into
      // `curId` when `value` param equals `0`.
      setCompState({
        ...compState,
        curId: curId.concat(curId[curId.length - 1])
      });
      setModal({ visible: true, categoryName: '' });
    }
  };

  const delCategory = () => {
    const { curId } = compState;
    BlogServices.deleteCategory(curId[curId.length - 1])
      .then((data: any) => {
        if (data.success) {
          message.warning('删除成功');
        } else {
          message.warning(data.msg);
        }
      })
      .catch((e: any) => message.error(`错误：${e}`));
  };

  const handleChangeInner = (value: any) => {
    const children: any[] = [];
    if (parseInt(value, 10)) {
      const { categoryData } = compState;
      getChildren(value, categoryData);
      if (categoryTemp) {
        categoryTemp.map((item: any) =>
          children.push(
            <Option key={`${item.id}s`} value={item.id}>
              {item.name}
            </Option>
          )
        );
      }
      return children;
    }
    setModal({ visible: true, categoryName: '' });
    return children;
  };

  const { children1, children2, children3, curId } = compState;
  const modalProps = {
    visible: modal.visible,
    categoryName: modal.categoryName,
    level: curId.length,
    categoryId: curId[curId.length - 1]
  };
  return (
    <div className='CategoryManage'>
      <div className='category-item'>
        <section>一级类目：</section>
        <Select
          placeholder='请选择'
          onSelect={handleChange1}
          style={{ width: 300 }}
        >
          <Option key={0}>添加</Option>
          {children1}
        </Select>
        <Button
          type='danger'
          style={{ margin: '0 10px' }}
          onClick={delCategory}
        >
          删除
        </Button>
      </div>
      <div className='category-item'>
        <section>二级类目：</section>
        <Select
          placeholder='请选择'
          onSelect={handleChange2}
          style={{ width: 300 }}
        >
          <Option key={0}>添加</Option>
          {children2}
        </Select>
        <Button
          type='danger'
          style={{ margin: '0 10px' }}
          onClick={delCategory}
        >
          删除
        </Button>
      </div>
      <div className='category-item'>
        <section>三级类目：</section>
        <Select
          placeholder='请选择'
          onSelect={handleChange3}
          style={{ width: 300 }}
        >
          <Option key={0}>添加</Option>
          {children3}
        </Select>
        <Button
          type='danger'
          style={{ margin: '0 10px' }}
          onClick={delCategory}
        >
          删除
        </Button>
      </div>
      {/* <div className="category-item"> */}
      {/* <Button style={{width: 300}} type="primary" onClick={this.handleSubmit}>提交</Button> */}
      {/* </div> */}
      <CategoryModal data={modalProps} />
    </div>
  );
};

export default CategoryManage;
