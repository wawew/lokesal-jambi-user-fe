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
import swal from "sweetalert";
import axios from "axios";

class Keluhkan extends React.Component {
  state = { loading: false };

  /**
   * Mengubah state foto yang akan diunggah
   *
   * @param {object} event Object yang diterima saat user memilih foto
   */
  ubahFoto = event => {
    store.setState({ uriFoto: "" });
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
        store.setState({
          foto: fileFoto,
          uriFoto: URL.createObjectURL(fileFoto),
          namaFoto: URL.createObjectURL(fileFoto)
        });
      } else {
        store.setState({
          foto: fileFoto,
          namaFoto: URL.createObjectURL(fileFoto)
        });
      }
    }
  };

  /**
   * Mengirim data keluhan baru untuk disimpan di database
   */
  kirimKeluhan = () => {
    this.setState({ loading: true });
    if (this.props.isiKeluhan === "") {
      this.setState({ loading: false });
      swal(
        "Kirim keluhan gagal!",
        "Isian keterangan keluhan harus diisi.",
        "error"
      );
    } else {
      if (this.props.foto !== null) {
        const fileFoto = this.props.foto.name;
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
          const link = `${moment().format()}_${this.props.foto.name}`;
          const uploadTask = storage
            .ref("keluhan")
            .child(link)
            .put(this.props.foto);
          uploadTask.on(
            "state_changed",
            () => console.log("..."),
            () => this.setState({ loading: false }),
            () => {
              storage
                .ref("keluhan")
                .child(link)
                .getDownloadURL()
                .then(url => {
                  store.setState({ linkFoto: url });
                  const request = {
                    method: "post",
                    url: `${store.getState().urlBackend}/pengguna/keluhan`,
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json"
                    },
                    data: {
                      foto_sebelum: this.props.linkFoto,
                      longitude: store.getState().lng,
                      latitude: store.getState().lat,
                      isi: this.props.isiKeluhan,
                      anonim: this.props.anonim
                    }
                  };
                  axios(request)
                    .then(response => {
                      this.setState({ loading: false });
                      store.setState({ isiKeluhan: "", anonim: false });
                      this.props.history.push("/keluhanku");
                    })
                    .catch(error => {
                      this.setState({ loading: false });
                      if (error.response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("terverifikasi");
                        localStorage.removeItem("id");
                        swal({
                          title: "Gagal Masuk!",
                          text:
                            "Akun anda telah dinonaktifkan. Silahkan hubungi Admin untuk informasi lebih lanjut.",
                          icon: "error"
                        });
                        this.props.history.push("/masuk");
                      } else {
                        swal(
                          "Kirim keluhan gagal!",
                          "Silahkan coba lagi.",
                          "error"
                        );
                      }
                    });
                });
            }
          );
        } else {
          this.setState({ loading: false });
          swal(
            "Kirim keluhan gagal!",
            "Ekstensi file foto harus jpg, jpeg, atau png.",
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
            foto_sebelum: this.props.linkFoto,
            longitude: store.getState().lng,
            latitude: store.getState().lat,
            isi: this.props.isiKeluhan,
            anonim: this.props.anonim
          }
        };
        axios(request)
          .then(response => {
            this.setState({ loading: false });
            store.setState({
              isiKeluhan: "",
              anonim: false,
              foto: null,
              uriFoto: "",
              linkFoto: "",
              namaFoto: ""
            });
            this.props.history.push("/keluhanku");
          })
          .catch(error => {
            this.setState({ loading: false });
            if (error.response.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("terverifikasi");
              localStorage.removeItem("id");
              swal({
                title: "Gagal Masuk!",
                text:
                  "Akun anda telah dinonaktifkan. Silahkan hubungi Admin untuk informasi lebih lanjut.",
                icon: "error"
              });
              this.props.history.push("/masuk");
            } else {
              swal("Kirim keluhan gagal!", "Silahkan coba lagi.", "error");
            }
          });
      }
    }
  };

  cekAnonim = () => {
    if (this.props.anonim === true) {
      store.setState({ anonim: false });
    } else {
      store.setState({ anonim: true });
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
              {this.props.uriFoto === "" ? (
                <div className="keluhkan-foto-kosong">
                  <FaImage />
                </div>
              ) : (
                <img alt="foto" src={this.props.uriFoto} />
              )}
            </Col>
          </Row>
          <Row className="keluhkan-foto-row">
            <Col></Col>
            <Col className="keluhkan-unggah" xs="auto">
              <input
                type="file"
                id="keluhkan-unggah-foto"
                className="keluhkan-unggah-foto"
                onChange={this.ubahFoto}
                accept="image/jpeg"
                capture="camera"
              />
              <Button
                variant="secondary"
                className="keluhkan-unggah-foto-button"
                onClick={() =>
                  document.getElementById("keluhkan-unggah-foto").click()
                }
              >
                Unggah Foto
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  document.querySelector("#keluhkan-unggah-foto").value = "";
                  store.setState({ foto: null, uriFoto: "", namaFoto: "" });
                }}
              >
                Hapus
              </Button>
            </Col>
            <Col></Col>
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
                    value={this.props.isiKeluhan}
                    onChange={event => {
                      store.setState({ isiKeluhan: event.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Keluhkan sebagai anonim"
                    checked={this.props.anonim}
                    onChange={() => this.cekAnonim()}
                  />
                </Form.Group>
                {this.state.loading ? (
                  <Container fluid className="namalokasi">
                    <Row>
                      <Col className="namalokasi-loading">
                        <Spinner animation="grow" variant="success" />
                      </Col>
                    </Row>
                  </Container>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.kirimKeluhan()}
                  >
                    Kirim Keluhan
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(
  "lokasiUser, loadingLokasiUser, isiKeluhan, anonim, foto, uriFoto, linkFoto, namaFoto",
  actions
)(withRouter(Keluhkan));
