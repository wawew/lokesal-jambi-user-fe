import React from "react";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";

class UnggahKTP extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Kembali path="/profil" />
      </React.Fragment>
    );
  }
}

export default withRouter(UnggahKTP);
