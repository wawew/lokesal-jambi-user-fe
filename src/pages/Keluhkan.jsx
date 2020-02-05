import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { store, actions } from "../store/store";
import Kembali from "../components/kembali";
import NamaLokasi from "../components/namaLokasi";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import "../styles/namaLokasi.css";

class Keluhkan extends React.Component {
  componentDidMount = () => {
    if (localStorage.getItem("token") === null) {
      this.props.history.push("/masuk");
    }
    // Get lokasi user
    if (store.getState().lng === 0 && store.getState().lat === 0) {
      navigator.geolocation.getCurrentPosition(position =>
        this.props.getLokasi([
          position.coords.longitude,
          position.coords.latitude
        ])
      );
    } else {
      this.props.getLokasi([store.getState().lng, store.getState().lat]);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Kembali path="/" />
        {this.props.loadingLokasiUser ? (
          <Container fluid className="namalokasi">
            <Row>
              <Col className="namalokasi-loading">
                <Spinner animation="grow" variant="success" />
              </Col>
            </Row>
          </Container>
        ) : (
          <div onClick={() => this.props.history.push("/carilokasi")}>
            <NamaLokasi lokasi={this.props.lokasiUser} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default connect(
  "lokasiUser, loadingLokasiUser",
  actions
)(withRouter(Keluhkan));
