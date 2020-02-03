import React from 'react';
import { Provider } from 'unistore/react';
import { store } from '../store/store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Beranda from '../pages/Beranda';

const MainRoute = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Beranda} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default MainRoute;
