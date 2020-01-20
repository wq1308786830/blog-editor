import React from 'react';
import PropTypes from 'prop-types';
import { Input, message, Modal } from 'antd';

import AdminServices from '../../../services/AdminServices';

class CategoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      fatherId: props.data.categoryId,
      level: props.data.level,
      categoryName: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data.categoryId !== nextProps.data.categoryId) {
      this.setState({ fatherId: nextProps.data.categoryId });
    }
    if (data.level !== nextProps.data.level) {
      this.setState({ level: nextProps.data.level });
    }
  }

  handleOk = () => {
    const { fatherId, level, categoryName } = this.state;
    AdminServices.addCategory(fatherId, level, categoryName)
      .then(data => {
        if (data.success) {
          message.success('添加成功');
        } else {
          message.warning(data.msg);
        }
      })
      .catch(e => message.error(`错误：${e}`));
  };

  render() {
    const { confirmLoading, categoryName, visible } = this.state;
    return (
      <Modal
        width={300}
        title="添加类目"
        okText="确定"
        cancelText="取消"
        wrapClassName="vertical-center-modal"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={this.handleOk}
        onCancel={() => this.setState({ visible: false })}
      >
        <p>
          <Input
            value={categoryName}
            onChange={e => this.setState({ categoryName: e.target.value })}
            placeholder="类目名"
          />
        </p>
      </Modal>
    );
  }
}

CategoryModal.propTypes = {
  data: PropTypes.shape({
    level: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired
  }).isRequired
};

export default CategoryModal;
