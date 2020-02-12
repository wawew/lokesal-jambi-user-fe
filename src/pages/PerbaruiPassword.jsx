import React from "react";
import axios from "axios";
import swal from "sweetalert";
import { store } from "../store/store";
import { Container, Row, Col, Form, Spinner, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";
import "../styles/masuk.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class PerbaruiPassword extends React.Component {
  state = {
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
    // eslint-disable-next-line
    regexPassword: new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,})"
    ),
    showPasswordLama: false,
    showPasswordBaru: false,
    showKonfirmasiPassword: false,
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
        kata_sandi_lama: this.state.passwordLama,
        kata_sandi_baru: this.state.passwordBaru
      }
    };
    axios(request)
      .then(response => {
        this.setState({ loading: false });
        localStorage.removeItem("token");
        localStorage.removeItem("terverifikasi");
        this.props.history.push("/masuk");
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
              "Perbarui password gagal!",
              "Password lama yang anda masukkan salah.",
              "error"
            );
          }
        } else {
          swal(
            "Perbarui password gagal!",
            "Password baru harus berbeda dengan password lama.",
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
              <h2>Perbarui Password</h2>
              <Form
                onSubmit={event => event.preventDefault()}
                className="profil-perbarui-form"
              >
                <Form.Group className="masuk-password">
                  <Form.Label>Masukkan password lama anda</Form.Label>
                  <Form.Control
                    type={this.state.showPasswordLama ? "text" : "password"}
                    onChange={event =>
                      this.setState({ passwordLama: event.target.value })
                    }
                  />
                  <div
                    className="masuk-showpassword"
                    onClick={() => {
                      this.state.showPasswordLama
                        ? this.setState({ showPasswordLama: false })
                        : this.setState({ showPasswordLama: true });
                    }}
                  >
                    {this.state.showPasswordLama ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Masukkan password baru anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.regexPassword.test(this.state.passwordBaru) ||
                      this.state.passwordBaru === ""
                        ? ""
                        : "masuk-email"
                    }
                    type={this.state.showPasswordBaru ? "text" : "password"}
                    onChange={event =>
                      this.setState({ passwordBaru: event.target.value })
                    }
                  />
                  {this.state.regexPassword.test(this.state.passwordBaru) ||
                  this.state.passwordBaru === "" ? (
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
                      this.state.showPasswordBaru
                        ? this.setState({ showPasswordBaru: false })
                        : this.setState({ showPasswordBaru: true });
                    }}
                  >
                    {this.state.showPasswordBaru ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </Form.Group>
                <Form.Group className="masuk-password">
                  <Form.Label>Konfirmasi password baru anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.konfirmasiPassword === this.state.passwordBaru
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
                  {this.state.konfirmasiPassword === this.state.passwordBaru ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Konfirmasi password baru anda tidak sesuai
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
                      this.state.passwordLama === "" ||
                      !this.state.regexPassword.test(this.state.passwordBaru) ||
                      this.state.passwordBaru === "" ||
                      this.state.konfirmasiPassword !== this.state.passwordBaru
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

export default withRouter(PerbaruiPassword);
