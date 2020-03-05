import React, { useState } from 'react';
import { Breadcrumb, Icon, Layout, Menu } from 'antd';
import { Link, Route, Switch } from 'react-router-dom';
import './Main.less';
import ArticleListManage from '../../components/AdminMain/ArticleListManage';
import ArticleEdit from '../../components/AdminMain/ArticleEdit';
import CategoryManage from '../CategoryManage/CategoryManage';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(collapsed => !collapsed);
  };

  return (
    <Layout className='AdminMain' style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible={true} collapsed={collapsed}>
        <Menu
          theme='light'
          defaultSelectedKeys={['1']}
          mode='inline'
          style={{ height: '100%' }}
        >
          <Menu.Item key='1'>
            <Link to='/admin/articleListManage'>
              <Icon type='pie-chart' />
              <span>首页</span>
            </Link>
          </Menu.Item>
          <Menu.Item key='2'>
            <Link to='/admin/articleEdit'>
              <Icon type='desktop' />
              <span>资源管理</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key='sub1'
            title={
              <span>
                <Icon type='user' />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key='3'>Tom</Menu.Item>
            <Menu.Item key='4'>Bill</Menu.Item>
            <Menu.Item key='5'>Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key='sub2'
            title={
              <span>
                <Icon type='team' />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key='6'>Team 1</Menu.Item>
            <Menu.Item key='8'>Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key='9'>
            <Link to='/admin/categoryManage'>
              <Icon type='file' />
              <span>类目管理</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Icon
            className='trigger'
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggle}
          />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} />
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Switch>
              <Route
                exact={true}
                path='/admin/articleListManage'
                component={ArticleListManage}
              />
              <Route
                exact={true}
                path='/admin/articleEdit/:categoryId/:articleId'
                component={ArticleEdit}
              />
              <Route exact={true} path='/admin/articleEdit' component={ArticleEdit} />
              <Route
                exact={true}
                path='/admin/categoryManage'
                component={CategoryManage}
              />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Russell ©2018</Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
