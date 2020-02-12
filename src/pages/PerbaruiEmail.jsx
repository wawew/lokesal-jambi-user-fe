import React from "react";
import axios from "axios";
import swal from "sweetalert";
import { store } from "../store/store";
import { Container, Row, Col, Form, Spinner, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";
import "../styles/masuk.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class PerbaruiEmail extends React.Component {
  state = {
    emailLama: "",
    emailBaru: "",
    password: "",
    // eslint-disable-next-line
    regexEmail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/,
    showPassword: false,
    loading: false
  };

  perbarui = () => {
    this.setState({ loading: true });
    const request = {
      method: "put",
      url: `${store.getState().urlBackend}/pengguna/profil`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      data: {
        email_lama: this.state.emailLama,
        email_baru: this.state.emailBaru,
        kata_sandi_lama: this.state.password
      }
    };
    axios(request)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push("/profil");
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response.status === 401) {
          if (
            error.response.data.pesan ===
            "Akun anda telah dinonaktifkan. Silahkan hubungi Admin untuk informasi lebih lanjut."
          ) {
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
              "Perbarui email gagal!",
              "Password yang anda masukkan salah.",
              "error"
            );
          }
        } else if (
          error.response.data.pesan === "Email yang anda masukan salah."
        ) {
          swal(
            "Perbarui email gagal!",
            "Email lama yang anda masukkan salah.",
            "error"
          );
        } else if (
          error.response.data.pesan ===
          "Email baru harus berbeda dengan email lama."
        ) {
          swal(
            "Perbarui email gagal!",
            "Email baru harus berbeda dengan email lama.",
            "error"
          );
        } else if (
          error.response.data.pesan === "Email sudah ada yang memakai."
        ) {
          swal(
            "Perbarui email gagal!",
            "Email baru yang anda masukkan sudah terdaftar.",
            "error"
          );
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        <Kembali path="/profil" />
        <Container fluid className="profil-perbaruinama">
          <Row>
            <Col>
              <h2>Perbarui Email</h2>
              <Form
                onSubmit={event => event.preventDefault()}
                className="profil-perbarui-form"
              >
                <Form.Group>
                  <Form.Label>Masukkan email lama anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ emailLama: event.target.value })
                    }
                    className={
                      this.state.regexEmail.test(this.state.emailLama) ||
                      this.state.emailLama === ""
                        ? ""
                        : "masuk-email"
                    }
                  />
                  {this.state.regexEmail.test(this.state.emailLama) ||
                  this.state.emailLama === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Format email lama anda salah
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Masukkan email baru anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ emailBaru: event.target.value })
                    }
                    className={
                      this.state.regexEmail.test(this.state.emailBaru) ||
                      this.state.emailBaru === ""
                        ? ""
                        : "masuk-email"
                    }
                  />
                  {this.state.regexEmail.test(this.state.emailBaru) ||
                  this.state.emailBaru === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Format email baru anda salah
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
                  <div className="profil-perbarui-spinner">
                    <Spinner animation="grow" variant="success" />
                  </div>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.perbarui()}
                    disabled={
                      !this.state.regexEmail.test(this.state.emailLama) ||
                      this.state.emailLama === "" ||
                      !this.state.regexEmail.test(this.state.emailBaru) ||
                      this.state.emailBaru === "" ||
                      this.state.password === ""
                        ? true
                        : false
                    }
                  >
                    Perbarui
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

export default withRouter(PerbaruiEmail);
