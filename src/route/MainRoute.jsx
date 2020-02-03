import React from 'react';
import { Provider } from 'unistore/react';
import { store } from '../store/store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Beranda from '../pages/Beranda';
import Keluhkan from '../pages/Keluhkan';
import CariLokasi from '../pages/CariLokasi';

const MainRoute = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Beranda} />
          <Route exact path="/keluhkan" component={Keluhkan} />
          <Route exact path="/carilokasi" component={CariLokasi} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default MainRoute;
