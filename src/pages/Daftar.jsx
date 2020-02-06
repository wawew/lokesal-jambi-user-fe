import React from "react";
import axios from "axios";
import { store } from "../store/store";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import Kembali from "../components/kembali";
import "../styles/masuk.css";
import logo from "../images/logo-transparent.png";
import swal from "sweetalert";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class Daftar extends React.Component {
  state = {
    email: "",
    password: "",
    konfirmasiPassword: "",
    namaDepan: "",
    namaBelakang: "",
    nomorTelepon: "",
    // eslint-disable-next-line
    regexEmail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/,
    // eslint-disable-next-line
    regexPassword: new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,})"
    ),
    regexNomorTelepon: new RegExp("^[0-9][0-9]{9,14}$"),
    showPassword: false,
    showKonfirmasiPassword: false,
    loading: false
  };

  daftar = () => {
    this.setState({ loading: true });
    const request = {
      method: "post",
      url: `${store.getState().urlBackend}/daftar`,
      headers: { "Content-Type": "application/json" },
      data: {
        email: this.state.email,
        kata_sandi: this.state.password,
        nama_depan: this.state.namaDepan,
        nama_belakang: this.state.namaBelakang,
        telepon: this.state.nomorTelepon,
        kota: store.getState().namaKota
      }
    };
    axios(request)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("terverifikasi", response.data.terverifikasi);
        this.setState({ loading: false });
        swal({
          title: "Berhasil Daftar!",
          text:
            "Silahkan lakukan verifikasi akun anda dengan mengunggah foto KTP di halaman profil",
          icon: "success"
        }).then(() => this.props.history.push("/"));
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response.data.pesan === "Email sudah terdaftar.") {
          swal({
            title: "Gagal Daftar!",
            text: "Email anda sudah terdaftar",
            icon: "error"
          });
        } else if (error.response.data.pesan === "Telepon sudah terdaftar.") {
          swal({
            title: "Gagal Daftar!",
            text: "Nomor telepon anda sudah terdaftar",
            icon: "error"
          });
        }
      });
  };

  componentDidMount = () => {
    if (localStorage.getItem("token") !== null) {
      this.props.history.push("/profil");
    }
  };

  render() {
    return (
      <React.Fragment>
        <Kembali path="/" />
        <Container className="masuk">
          <Row>
            <Col>
              <img alt="logo" src={logo} />
              <Form onSubmit={event => event.preventDefault()}>
                <Form.Group>
                  <Form.Label>Masukkan email anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ email: event.target.value })
                    }
                    className={
                      this.state.regexEmail.test(this.state.email) ||
                      this.state.email === ""
                        ? ""
                        : "masuk-email"
                    }
                  />
                  {this.state.regexEmail.test(this.state.email) ||
                  this.state.email === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Format email anda salah
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Masukkan password anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.regexPassword.test(this.state.password) ||
                      this.state.password === ""
                        ? ""
                        : "masuk-email"
                    }
                    type={this.state.showPassword ? "text" : "password"}
                    onChange={event =>
                      this.setState({ password: event.target.value })
                    }
                  />
                  {this.state.regexPassword.test(this.state.password) ||
                  this.state.password === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Panjang password minimal 8 karakter dan memuat minimal 1
                      huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter
                      spesial
                    </Form.Text>
                  )}
                  <div
                    className="masuk-showpassword"
                    onClick={() => {
                      this.state.showPassword
                        ? this.setState({ showPassword: false })
                        : this.setState({ showPassword: true });
                    }}
                  >
                    {this.state.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Konfirmasi password anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.konfirmasiPassword === this.state.password
                        ? ""
                        : "masuk-email"
                    }
                    type={
                      this.state.showKonfirmasiPassword ? "text" : "password"
                    }
                    onChange={event =>
                      this.setState({ konfirmasiPassword: event.target.value })
                    }
                  />
                  {this.state.konfirmasiPassword === this.state.password ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Konfirmasi password anda tidak sesuai
                    </Form.Text>
                  )}
                  <div
                    className="masuk-showpassword"
                    onClick={() => {
                      this.state.showKonfirmasiPassword
                        ? this.setState({ showKonfirmasiPassword: false })
                        : this.setState({ showKonfirmasiPassword: true });
                    }}
                  >
                    {this.state.showKonfirmasiPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </div>
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Masukkan nama depan anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ namaDepan: event.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Masukkan nama belakang anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ namaBelakang: event.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Masukkan nomor telepon anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.regexNomorTelepon.test(
                        this.state.nomorTelepon
                      ) || this.state.nomorTelepon === ""
                        ? ""
                        : "masuk-email"
                    }
                    type="text"
                    onChange={event =>
                      this.setState({ nomorTelepon: event.target.value })
                    }
                  />
                  {this.state.regexNomorTelepon.test(this.state.nomorTelepon) ||
                  this.state.nomorTelepon === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Nomor telepon harus berupa 10-15 digit angka
                    </Form.Text>
                  )}
                </Form.Group>
                {this.state.loading ? (
                  <div className="masuk-spinner">
                    <Spinner animation="grow" variant="success" />
                  </div>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.daftar()}
                    disabled={
                      !this.state.regexEmail.test(this.state.email) ||
                      this.state.email === "" ||
                      !this.state.regexPassword.test(this.state.password) ||
                      this.state.password === "" ||
                      this.state.konfirmasiPassword !== this.state.password ||
                      this.state.namaDepan === "" ||
                      this.state.namaBelakang === "" ||
                      !this.state.regexNomorTelepon.test(
                        this.state.nomorTelepon
                      ) ||
                      this.state.nomorTelepon === ""
                        ? true
                        : false
                    }
                  >
                    Daftar
                  </Button>
                )}
              </Form>
              <h6>Sudah mempunyai akun?</h6>
              <h6>
                <span
                  className="masuk-link"
                  onClick={() => this.props.history.push("/masuk")}
                >
                  Masuk di sini
                </span>
              </h6>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Daftar);
