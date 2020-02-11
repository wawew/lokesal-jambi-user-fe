import React from "react";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import swal from "sweetalert";
import axios from "axios";
import { storage } from "../config/firebase";
import moment from "moment";
import { store } from "../store/store";

class UnggahFoto extends React.Component {
  state = {
    foto: null,
    urlFoto: "",
    linkFoto: "",
    loading: false
  };

  ubahFoto = event => {
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
          urlFoto: URL.createObjectURL(fileFoto)
        });
      } else {
        swal(
          "Pilih foto gagal!",
          "Ekstensi file foto harus jpg, jpeg, atau png.",
          "error"
        );
      }
    }
  };

  hapusFoto = () => {
    this.setState({ loading: true });
    const request = {
      method: "put",
      url: `${store.getState().urlBackend}/pengguna/profil`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      data: {
        avatar: ""
      }
    };
    axios(request)
      .then(response => {
        this.setState({ loading: false, urlFoto: "" });
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
          swal("Hapus foto gagal!", "Silahkan coba lagi.", "error");
        }
      });
  };

  unggahFoto = () => {
    this.setState({ loading: true });
    const link = `${moment().format()}_${this.state.foto.name}`;
    const uploadTask = storage
      .ref("profil")
      .child(link)
      .put(this.state.foto);
    uploadTask.on(
      "state_changed",
      () => console.log("..."),
      () => console.log("..."),
      () => {
        storage
          .ref("profil")
          .child(link)
          .getDownloadURL()
          .then(url => {
            this.setState({ linkFoto: url });
            const request = {
              method: "put",
              url: `${store.getState().urlBackend}/pengguna/profil`,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
              },
              data: {
                avatar: this.state.linkFoto
              }
            };
            axios(request)
              .then(response => {
                this.setState({
                  loading: false,
                  urlFoto: response.data.avatar
                });
                this.props.history.push("/profil");
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
                  swal("Unggah foto gagal!", "Silahkan coba lagi.", "error");
                }
              });
          });
      }
    );
  };

  batal = () => {
    document.querySelector("#profil-unggahfoto").value = "";
    this.setState({ foto: null, loading: true });
    const request = {
      method: "get",
      url: `${store.getState().urlBackend}/pengguna/profil`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    };
    axios(request)
      .then(response => {
        this.setState({
          loading: false,
          urlFoto: response.data.avatar,
          foto: null
        });
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
        }
      });
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    const request = {
      method: "get",
      url: `${store.getState().urlBackend}/pengguna/profil`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    };
    axios(request)
      .then(response => {
        this.setState({ loading: false, urlFoto: response.data.avatar });
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
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        <Kembali path="/profil" />
        <Container className="profil-perbaruiktp">
          <Row>
            <Col>
              <h2>Perbarui Foto Profil</h2>
              {this.state.urlFoto === "" ? (
                <div className="profil-unggahfoto-kosong">
                  <FaUserCircle />
                </div>
              ) : (
                <div className="profil-perbaruifoto">
                  <img alt="foto" src={this.state.urlFoto} />
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col xs="auto">
              <input
                type="file"
                id="profil-unggahfoto"
                style={{ display: "none" }}
                onChange={this.ubahFoto}
              />
              {this.state.loading === true ? (
                <Spinner variant="success" animation="grow" />
              ) : this.state.foto === null ? (
                <div>
                  <Button
                    variant="secondary"
                    style={{ marginRight: "5px" }}
                    onClick={() =>
                      document.getElementById("profil-unggahfoto").click()
                    }
                  >
                    Ubah Foto
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => this.hapusFoto()}
                    style={{ marginLeft: "5px" }}
                  >
                    Hapus Foto
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="success"
                    style={{ marginRight: "5px" }}
                    onClick={() => this.unggahFoto()}
                  >
                    Unggah Foto
                  </Button>
                  <Button
                    variant="danger"
                    style={{ marginLeft: "5px" }}
                    onClick={() => this.batal()}
                  >
                    Batal
                  </Button>
                </div>
              )}
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(UnggahFoto);
