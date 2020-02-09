import React from "react";
import { Provider } from "unistore/react";
import { store } from "../store/store";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Beranda from "../pages/Beranda";
import Masuk from "../pages/Masuk";
import Daftar from "../pages/Daftar";
import Profil from "../pages/Profil";
import Keluhkan from "../pages/Keluhkan";
import CariLokasi from "../pages/CariLokasi";
import PetaLokasi from "../pages/PetaLokasi";
import Laporan from "../pages/Laporan";
import Keluhanku from "../pages/Keluhanku";
import DetailLaporan from "../pages/DetailLaporan";
import NotFound from "../pages/NotFound";

const MainRoute = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Beranda} />
          <Route exact path="/masuk" component={Masuk} />
          <Route exact path="/daftar" component={Daftar} />
          <Route exact path="/profil" component={Profil} />
          <Route exact path="/keluhkan" component={Keluhkan} />
          <Route exact path="/carilokasi" component={CariLokasi} />
          <Route exact path="/petalokasi" component={PetaLokasi} />
          <Route exact path="/laporan" component={Laporan} />
          <Route exact path="/keluhanku" component={Keluhanku} />
          <Route exact path="/laporan/:id" component={DetailLaporan} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default MainRoute;
