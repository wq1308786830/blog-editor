import React, { useEffect, useState } from "react";
import { Input, message, Modal } from "antd";

import AdminServices from "../../../services/admin";

interface CategoryModalProps {
  data: any;
}

interface CategoryModalState {
  visible: boolean;
  confirmLoading: boolean;
  fatherId: number;
  level: number;
  categoryName: string;
}

const CategoryModal = (props: CategoryModalProps) => {
  const { data } = props;
  const initState: CategoryModalState = {
    visible: false,
    confirmLoading: false,
    fatherId: props.data.categoryId,
    level: props.data.level,
    categoryName: ""
  };
  const [compState, setCompState] = useState(initState);

  useEffect(() => {
    setCompState({
      ...compState,
      fatherId: data.categoryId,
      level: data.level
    });
  }, [compState, data]);

  const handleOk = () => {
    const { fatherId, level, categoryName } = compState;
    AdminServices.addCategory(fatherId, level, categoryName)
      .then((data: any) => {
        if (data.success) {
          message.success("添加成功");
        } else {
          message.warning(data.msg);
        }
      })
      .catch((e: any) => message.error(`错误：${e}`));
  };

  const { confirmLoading, categoryName, visible } = compState;
  return (
    <Modal
      width={300}
      title="添加类目"
      okText="确定"
      cancelText="取消"
      wrapClassName="vertical-center-modal"
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={() => setCompState({ ...compState, visible: false })}
    >
      <p>
        <Input
          value={categoryName}
          onChange={e =>
            setCompState({ ...compState, categoryName: e.target.value })
          }
          placeholder="类目名"
        />
      </p>
    </Modal>
  );
};

export default CategoryModal;
