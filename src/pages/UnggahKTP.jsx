import React from "react";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaIdCard } from "react-icons/fa";
import swal from "sweetalert";
import axios from "axios";
import { storage } from "../config/firebase";
import moment from "moment";
import { store } from "../store/store";

class UnggahKTP extends React.Component {
  state = {
    foto: null,
    urlFoto: "",
    linkFoto: "",
    loading: false
  };

  /**
   * Mengubah state foto berdasarkan file yang dipilih user
   *
   * @param {object} event file foto yang dipilih user
   */
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

  /**
   * Mengunggah foto ke firebase dan menyimpan url foto di database
   */
  unggahFoto = () => {
    this.setState({ loading: true });
    const link = `${moment().format()}_${this.state.foto.name}`;
    const uploadTask = storage
      .ref("ktp")
      .child(link)
      .put(this.state.foto);
    uploadTask.on(
      "state_changed",
      () => console.log("..."),
      () => console.log("..."),
      () => {
        storage
          .ref("ktp")
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
                ktp: this.state.linkFoto
              }
            };
            axios(request)
              .then(response => {
                this.setState({ loading: false });
                swal(
                  "Unggah foto KTP berhasil!",
                  "Silahkan tunggu respon dari admin.",
                  "success"
                );
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
                  swal(
                    "Unggah foto KTP gagal!",
                    "Silahkan coba lagi.",
                    "error"
                  );
                }
              });
          });
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <Kembali path="/profil" />
        <Container className="profil-perbaruiktp">
          <Row>
            <Col>
              <h2>Unggah Foto KTP</h2>
              {this.state.urlFoto === "" ? (
                <div className="profil-perbaruiktp-kosong">
                  <FaIdCard />
                </div>
              ) : (
                <img alt="ktp" src={this.state.urlFoto} />
              )}
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col xs="auto">
              <input
                type="file"
                id="profil-unggahktp"
                style={{ display: "none" }}
                onChange={this.ubahFoto}
                accept="image/jpeg"
                capture="camera"
              />
              {this.state.loading === true ? (
                <Spinner variant="success" animation="grow" />
              ) : this.state.urlFoto === "" ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("profil-unggahktp").click()
                  }
                >
                  Pilih Foto
                </Button>
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
                    onClick={() => {
                      document.querySelector("#profil-unggahktp").value = "";
                      this.setState({ foto: null, urlFoto: "" });
                    }}
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

export default withRouter(UnggahKTP);
