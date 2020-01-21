import React from "react";
import { Button, Checkbox, Form, Icon, Input, message } from "antd";
import Recaptcha from "react-recaptcha";
import AdminServices from "../../../services/admin";
import "./NormalLoginForm.less";

interface LoginFormProps {
  form: any;
  history: any;
}

const NormalLoginForm = (props: LoginFormProps) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, history } = props;
    form.validateFields((err: any, values: any) => {
      if (!err) {
        AdminServices.login(values)
          .then((data: any) => {
            if (data.success) {
              localStorage.setItem("user", "1");
              history.push("/admin");
            } else {
              message.error(`错误：${data.msg}`);
            }
          })
          .catch((error: any) => {
            error.response
              .json()
              .then((data: any) =>
                message.error(`错误${e.response.status}：${data.msg}`)
              );
          });
      }
    });
  };

  const onloadCallback = () => {
    window.console.log("Done!!!");
  };

  const verifyCallback = (resp: any) => {
    window.console.log(resp);
  };

  const { form } = props;
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {form.getFieldDecorator("user_name", {
          rules: [{ required: true, message: "请输入用户名!" }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="用户名"
          />
        )}
      </Form.Item>
      <Form.Item>
        {form.getFieldDecorator("password", {
          rules: [{ required: true, message: "请输入密码!" }]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="密码"
          />
        )}
      </Form.Item>
      <Form.Item>
        {form.getFieldDecorator("remember", {
          valuePropName: "checked",
          initialValue: true
        })(<Checkbox>记住我</Checkbox>)}
        <Button className="login-form-forgot">忘记密码？</Button>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form.Item>
      <Recaptcha
        sitekey="6LfEhDwUAAAAAPEPGFpooDYCHBczNAUu90medQoD"
        render="explicit"
        verifyCallback={verifyCallback}
        onloadCallback={onloadCallback}
        type="image"
        hl="zh-CN"
      />
    </Form>
  );
};

export default NormalLoginForm;
