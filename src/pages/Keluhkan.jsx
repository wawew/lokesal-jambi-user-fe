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
import "react-html5-camera-photo/build/css/index.css";
import swal from "sweetalert";
import axios from "axios";

class Keluhkan extends React.Component {
  state = {
    foto: null,
    uriFoto: "",
    linkFoto: "",
    isi: "",
    anonim: false,
    namaFoto: ""
  };

  ubahFoto = event => {
    this.setState({ uriFoto: "" });
    const fileFoto = event.target.files[0];
    if (fileFoto) {
      if (
        fileFoto.name.lastIndexOf(".") > 0 &&
        (fileFoto.name
          .substring(fileFoto.name.lastIndexOf(".") + 1, fileFoto.name.length)
          .toLowerCase() === "jpg" ||
          fileFoto.name
            .substring(fileFoto.name.lastIndexOf(".") + 1, fileFoto.name.length)
            .toLowerCase() === "jpeg" ||
          fileFoto.name
            .substring(fileFoto.name.lastIndexOf(".") + 1, fileFoto.name.length)
            .toLowerCase() === "png")
      ) {
        this.setState({
          foto: fileFoto,
          uriFoto: URL.createObjectURL(fileFoto),
          namaFoto: URL.createObjectURL(fileFoto)
        });
      } else {
        this.setState({
          foto: fileFoto,
          namaFoto: URL.createObjectURL(fileFoto)
        });
      }
    }
  };

  kirimKeluhan = () => {
    if (this.state.isi === "") {
      swal(
        "Kirim keluhan gagal!",
        "Isian keterangan keluhan harus diisi",
        "error"
      );
    } else {
      if (this.state.foto !== null) {
        const fileFoto = this.state.foto.name;
        if (
          fileFoto.lastIndexOf(".") > 0 &&
          (fileFoto
            .substring(fileFoto.lastIndexOf(".") + 1, fileFoto.length)
            .toLowerCase() === "jpg" ||
            fileFoto
              .substring(fileFoto.lastIndexOf(".") + 1, fileFoto.length)
              .toLowerCase() === "jpeg" ||
            fileFoto
              .substring(fileFoto.lastIndexOf(".") + 1, fileFoto.length)
              .toLowerCase() === "png")
        ) {
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
                  const request = {
                    method: "post",
                    url: `${store.getState().urlBackend}/pengguna/keluhan`,
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json"
                    },
                    data: {
                      foto_sebelum: this.state.linkFoto,
                      longitude: store.getState().lng,
                      latitude: store.getState().lat,
                      isi: this.state.isi,
                      anonim: this.state.anonim
                    }
                  };
                  axios(request)
                    .then(response => {
                      this.props.history.push(`/keluhan/${response.data.id}`);
                    })
                    .catch(() => {
                      swal(
                        "Kirim keluhan gagal!",
                        "Silahkan coba lagi",
                        "error"
                      );
                    });
                });
            }
          );
        } else {
          swal(
            "Kirim keluhan gagal!",
            "Ekstensi file foto harus jpg, jpeg, atau png",
            "error"
          );
        }
      } else {
        const request = {
          method: "post",
          url: `${store.getState().urlBackend}/pengguna/keluhan`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          data: {
            foto_sebelum: this.state.linkFoto,
            longitude: store.getState().lng,
            latitude: store.getState().lat,
            isi: this.state.isi,
            anonim: this.state.anonim
          }
        };
        axios(request)
          .then(response => {
            this.props.history.push(`/keluhan/${response.data.id}`);
          })
          .catch(() => {
            swal("Kirim keluhan gagal!", "Silahkan coba lagi", "error");
          });
      }
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
          <Row className="keluhkan-foto-row">
            <Col className="keluhkan-unggah">
              <Container>
                <Row>
                  <Col className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      onChange={this.ubahFoto}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {this.state.namaFoto === ""
                        ? "Unggah foto"
                        : this.state.foto.name}
                    </label>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col xs="auto">
              <Button
                variant="danger"
                onClick={() => {
                  document.querySelector("#customFile").value = "";
                  this.setState({ foto: null, uriFoto: "", namaFoto: "" });
                }}
              >
                Hapus
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
      </React.Fragment>
    );
  }
}

export default connect(
  "lokasiUser, loadingLokasiUser",
  actions
)(withRouter(Keluhkan));
