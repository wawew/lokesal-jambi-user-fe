import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { store, actions } from "../store/store";
import Kembali from "../components/kembali";
import NamaLokasi from "../components/namaLokasi";
import { Spinner, Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/namaLokasi.css";
import "../styles/keluhkan.css";
import { FaImage } from "react-icons/fa";

class Keluhkan extends React.Component {
  state = {
    foto: "",
    isi: "",
    anonim: false,
    hoverFoto: false
  };

  cekAnonim = () => {
    if (this.state.anonim === true) {
      this.setState({ anonim: false });
    } else {
      this.setState({ anonim: true });
    }
  };

  componentDidMount = () => {
    if (
      localStorage.getItem("token") === null ||
      localStorage.getItem("terverifikasi") === "false"
    ) {
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
        <Container fluid className="keluhkan-foto">
          <Row>
            <Col>
              {this.state.foto === "" ? (
                <div className="keluhkan-foto-kosong">
                  <FaImage />
                  <h6>Klik di sini untuk mengunggah foto</h6>
                </div>
              ) : (
                <img alt="foto" src={this.state.foto} />
              )}
            </Col>
          </Row>
        </Container>
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
        <Container fluid className="keluhkan-textarea">
          <Row>
            <Col>
              <Form onSubmit={event => event.preventDefault()}>
                <Form.Group>
                  <Form.Label>Masukkan keluhan anda</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    onChange={event =>
                      this.setState({ isi: event.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Keluhkan sebagai anonim"
                    onClick={() => this.cekAnonim()}
                  />
                </Form.Group>
                <Button variant="success" type="submit">
                  Kirim Keluhan
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(
  "lokasiUser, loadingLokasiUser",
  actions
)(withRouter(Keluhkan));
