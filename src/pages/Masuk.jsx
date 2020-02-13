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

class Masuk extends React.Component {
  state = {
    email: "",
    password: "",
    // eslint-disable-next-line
    regexEmail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/,
    showPassword: false,
    loading: false
  };

  /**
   * Mengakses backend untuk mendapatkan token dan data-data lainnya
   * yang digunakan untuk masuk sebagai user
   */
  masuk = () => {
    this.setState({ loading: true });
    const request = {
      method: "post",
      url: `${store.getState().urlBackend}/masuk`,
      headers: { "Content-Type": "application/json" },
      data: {
        email: this.state.email,
        kata_sandi: this.state.password,
        kota: store.getState().namaKota
      }
    };
    axios(request)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("terverifikasi", response.data.terverifikasi);
        localStorage.setItem("id", response.data.id);
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response.data.pesan === "Email atau kata sandi salah.") {
          swal({
            title: "Gagal Masuk!",
            text: "Email atau password anda salah.",
            icon: "error"
          });
        } else {
          swal({
            title: "Gagal Masuk!",
            text:
              "Akun anda telah dinonaktifkan. Silahkan hubungi Admin untuk informasi lebih lanjut.",
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
                    type={this.state.showPassword ? "text" : "password"}
                    onChange={event =>
                      this.setState({ password: event.target.value })
                    }
                  />
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
                {this.state.loading ? (
                  <div className="masuk-spinner">
                    <Spinner animation="grow" variant="success" />
                  </div>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.masuk()}
                    disabled={
                      !this.state.regexEmail.test(this.state.email) ||
                      this.state.email === "" ||
                      this.state.password === ""
                        ? true
                        : false
                    }
                  >
                    Masuk
                  </Button>
                )}
              </Form>
              <h6>Belum mempunyai akun?</h6>
              <h6>
                <span
                  className="masuk-link"
                  onClick={() => this.props.history.push("/daftar")}
                >
                  Daftar di sini
                </span>
              </h6>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Masuk);
