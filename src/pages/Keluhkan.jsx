import React from "react";
import moment from "moment";
import { storage } from "../config/firebase";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { store, actions } from "../store/store";
import Kembali from "../components/kembali";
import NamaLokasi from "../components/namaLokasi";
import { Spinner, Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/namaLokasi.css";
import "../styles/keluhkan.css";
import { FaImage } from "react-icons/fa";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

class Keluhkan extends React.Component {
  state = {
    foto: null,
    uriFoto: "",
    linkFoto: "",
    isi: "",
    anonim: false,
    hoverFoto: false,
    kamera: false,
    perangkat: false
  };

  ubahFoto = event => {
    if (event.target.files[0]) {
      this.setState({
        foto: event.target.files[0],
        uriFoto: URL.createObjectURL(event.target.files[0]),
        perangkat: true
      });
    }
  };

  ambilFoto = dataUri => {
    this.setState({ kamera: false, uriFoto: dataUri, perangkat: false });
  };

  kirimKeluhan = () => {
    if (this.state.perangkat) {
      const link = `${moment().format()}_${this.state.foto.name}`;
      const uploadTask = storage
        .ref("keluhan")
        .child(link)
        .put(this.state.foto);
      uploadTask.on(
        "state_changed",
        () => console.log("..."),
        error => console.warn(error),
        () => {
          storage
            .ref("keluhan")
            .child(link)
            .getDownloadURL()
            .then(url => {
              this.setState({ linkFoto: url });
            });
        }
      );
    } else {
      const link = `${moment().format()}_foto.png`;
      const uploadTask = storage
        .ref("keluhan")
        .child(link)
        .putString(this.state.uriFoto.slice(22), "base64", {
          contentType: "image/png"
        });
      uploadTask.on(
        "state_changed",
        () => console.log("..."),
        error => console.warn(error),
        () => {
          storage
            .ref("keluhan")
            .child(link)
            .getDownloadURL()
            .then(url => {
              this.setState({ linkFoto: url });
            });
        }
      );
    }
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
        {this.state.kamera ? (
          <Camera
            onTakePhoto={dataUri => this.ambilFoto(dataUri)}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            isImageMirror={false}
            isMaxResolution={true}
          />
        ) : (
          <div></div>
        )}
        <div className={this.state.kamera ? "keluhkan-hidden" : ""}>
          <Kembali path="/" />
          <Container fluid className="keluhkan-foto">
            <Row>
              <Col>
                {this.state.uriFoto === "" ? (
                  <div className="keluhkan-foto-kosong">
                    <FaImage />
                  </div>
                ) : (
                  <img alt="foto" src={this.state.uriFoto} />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <input type="file" onChange={this.ubahFoto} />
              </Col>
              <Col>
                <Button onClick={() => this.setState({ kamera: true })}>
                  Dengan Kamera
                </Button>
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
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.kirimKeluhan()}
                  >
                    Kirim Keluhan
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  "lokasiUser, loadingLokasiUser",
  actions
)(withRouter(Keluhkan));
