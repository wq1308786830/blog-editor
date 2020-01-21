import React from "react";
import { Card, Col, Form, Layout, Row } from "antd";
import NormalLoginForm from "../../components/NormalLoginForm/NormalLoginForm";

import "./Login.less";

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const Login = () => {
  return (
    <Layout className="Login gradient-bg">
      <div className="back-img">
        <Row className="form-container">
          <Col span={6} offset={18}>
            <Card style={{ width: 350 }} className="Card">
              <WrappedNormalLoginForm />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Login;
