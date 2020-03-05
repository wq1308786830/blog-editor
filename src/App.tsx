import React from 'react';
import Loadable from 'react-loadable';
import { Redirect, Route, Router } from 'react-router-dom';
import { Spin } from 'antd';
import moment from 'moment';
import { createBrowserHistory } from 'history';

import 'moment/locale/zh-cn';
import './App.less';

const history = createBrowserHistory();
moment.locale('zh-cn');

const Loading = () => (
  <div className='loading'>
    <Spin size='large' />
  </div>
);

const AdminMain = Loadable({
  loader: () => import('./pages/admin/Main/Main'),
  loading: Loading
});

const Login = Loadable({
  loader: () => import('./pages/admin/Login'),
  loading: Loading
});

const App: React.FC = () => {
  return (
    <Router history={history}>
      <div className='App'>
        <Route exact={true} path='/' render={() => <Redirect to='/admin' />} />
        <PrivateRoute path='/admin' component={AdminMain} />
        <Route path='/loginAdmin' component={Login} />
      </div>
    </Router>
  );
}

// @ts-ignore
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('user') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/loginAdmin',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default App;

