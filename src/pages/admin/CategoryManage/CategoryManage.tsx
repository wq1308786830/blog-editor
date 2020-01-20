import React from 'react';
import { Button, message, Select } from 'antd';
import CategoryModal from './CategoryModal';
import BlogServices from '../../../services/BlogServices';
import './CategoryManage.less';

const { Option } = Select;

class CategoryManage extends React.Component {
  constructor(props) {
    super(props);
    this.categoryTemp = null; // category cache data.
    this.categoryModal = React.createRef();
    this.state = {
      curId: [],
      children1: [],
      children2: [],
      children3: [],
      categoryData: []
    };
  }

  componentDidMount() {
    this.getAllCategories();
  }

  /**
   * get next level children in data by `id`.
   * @param id
   * @param data
   */
  getChildren(id, data) {
    if (!data || !data.length) {
      return;
    }
    data.map(item => {
      if (item.id === parseInt(id, 10)) {
        this.categoryTemp = item.subCategory;
      } else {
        return this.getChildren(id, item.subCategory);
      }
      return this.categoryTemp;
    });
  }

  // get all categories data in json string.
  getAllCategories() {
    BlogServices.getAllCategories()
      .then(data => {
        if (data.success) {
          let children = data.data.map(item => <Option key={item.id}>{item.name}</Option>);
          this.setState({ children1: children });
          this.setState({ categoryData: data.data });
          children = null;
        } else {
          message.warning(data.msg);
        }
      })
      .catch(e => message.error(`错误：${e}`));
  }

  handleChange1 = value => {
    const { curId } = this.state;
    const children = this.handleChangeInner(value);
    this.setState({ children2: children });
    if (parseInt(value, 10)) {
      curId.splice(
        0 /* start position */,
        curId.length /* delete count */,
        value /* insert value */
      );
      this.setState({ curId });
    } else {
      // set first `curId` item as a default value `0` when `value` equals `0`.
      this.setState({ curId: [0] });
    }
  };

  handleChange2 = value => {
    const { curId } = this.state;
    const children = this.handleChangeInner(value);
    this.setState({ children3: children });
    if (parseInt(value, 10)) {
      curId.splice(1, curId.length - 1, value);
      this.setState({ curId });
    } else {
      // push the last item of `curId` array as a new item into
      // `curId` when `value` param equals `0`.
      this.setState({ curId: curId.concat(curId[curId.length - 1]) });
    }
  };

  handleChange3 = value => {
    const { curId } = this.state;
    if (parseInt(value, 10)) {
      this.setState({ curId: value });
      curId.splice(2, curId.length - 2, value);
      this.setState({ curId });
    } else {
      // push the last item of `curId` array as a new item into
      // `curId` when `value` param equals `0`.
      this.setState({ curId: curId.concat(curId[curId.length - 1]) });
      this.categoryModal.current.setState({ visible: true });
      this.categoryModal.current.setState({ categoryName: '' });
    }
  };

  delCategory = () => {
    const { curId } = this.state;
    BlogServices.deleteCategory(curId[curId.length - 1])
      .then(data => {
        if (data.success) {
          message.warning('删除成功');
        } else {
          message.warning(data.msg);
        }
      })
      .catch(e => message.error(`错误：${e}`));
  };

  handleChangeInner(value) {
    const children = [];
    if (parseInt(value, 10)) {
      const { categoryData } = this.state;
      this.getChildren(parseInt(value, 10), categoryData);
      if (this.categoryTemp) {
        this.categoryTemp.map(item =>
          children.push(
            <Option key={`${item.id}s`} value={item.id}>
              {item.name}
            </Option>
          )
        );
      }
      return children;
    }
    // refs下的属性首字母必须小写：categoryModal
    this.categoryModal.current.setState({ visible: true });
    this.categoryModal.current.setState({ categoryName: '' });
    return children;
  }

  render() {
    const { children1, children2, children3, curId } = this.state;
    return (
      <div className="CategoryManage">
        <div className="category-item">
          <section>一级类目：</section>
          <Select placeholder="请选择" onSelect={this.handleChange1} style={{ width: 300 }}>
            <Option key={0}>添加</Option>
            {children1}
          </Select>
          <Button type="danger" style={{ margin: '0 10px' }} onClick={this.delCategory}>
            删除
          </Button>
        </div>
        <div className="category-item">
          <section>二级类目：</section>
          <Select placeholder="请选择" onSelect={this.handleChange2} style={{ width: 300 }}>
            <Option key={0}>添加</Option>
            {children2}
          </Select>
          <Button type="danger" style={{ margin: '0 10px' }} onClick={this.delCategory}>
            删除
          </Button>
        </div>
        <div className="category-item">
          <section>三级类目：</section>
          <Select placeholder="请选择" onSelect={this.handleChange3} style={{ width: 300 }}>
            <Option key={0}>添加</Option>
            {children3}
          </Select>
          <Button type="danger" style={{ margin: '0 10px' }} onClick={this.delCategory}>
            删除
          </Button>
        </div>
        {/* <div className="category-item"> */}
        {/* <Button style={{width: 300}} type="primary" onClick={this.handleSubmit}>提交</Button> */}
        {/* </div> */}
        <CategoryModal
          ref={this.categoryModal}
          data={{ level: curId.length, categoryId: curId[curId.length - 1] }}
        />
      </div>
    );
  }
}

export default CategoryManage;
