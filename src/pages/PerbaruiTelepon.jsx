import React from "react";
import axios from "axios";
import swal from "sweetalert";
import { store } from "../store/store";
import { Container, Row, Col, Form, Spinner, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";
import "../styles/masuk.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class PerbaruiTelepon extends React.Component {
  state = {
    teleponLama: "",
    teleponBaru: "",
    regexNomorTelepon: new RegExp("^[0-9][0-9]{9,14}$"),
    password: "",
    showPassword: false,
    loading: false
  };

  /**
   * Mengakses backend untuk memperbarui nomor telepon user
   */
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
        telepon_lama: this.state.teleponLama,
        telepon_baru: this.state.teleponBaru,
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
              "Perbarui nomor telepon gagal!",
              "Password yang anda masukkan salah.",
              "error"
            );
          }
        } else if (
          error.response.data.pesan === "Nomor telepon yang anda masukan salah."
        ) {
          swal(
            "Perbarui nomor telepon gagal!",
            "Nomor telepon lama yang anda masukkan salah.",
            "error"
          );
        } else if (
          error.response.data.pesan ===
          "Nomor telepon baru harus berbeda dengan nomor telepon lama."
        ) {
          swal(
            "Perbarui nomor telepon gagal!",
            "Nomor telepon baru harus berbeda dengan nomor telepon lama.",
            "error"
          );
        } else if (
          error.response.data.pesan === "Nomor telepon sudah ada yang memakai."
        ) {
          swal(
            "Perbarui nomor telepon gagal!",
            "Nomor telepon baru yang anda masukkan sudah terdaftar.",
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
              <h2>Perbarui Nomor Telepon</h2>
              <Form
                onSubmit={event => event.preventDefault()}
                className="profil-perbarui-form"
              >
                <Form.Group>
                  <Form.Label>Masukkan nomor telepon lama anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.regexNomorTelepon.test(
                        this.state.teleponLama
                      ) || this.state.teleponLama === ""
                        ? ""
                        : "masuk-email"
                    }
                    type="text"
                    onChange={event =>
                      this.setState({ teleponLama: event.target.value })
                    }
                  />
                  {this.state.regexNomorTelepon.test(this.state.teleponLama) ||
                  this.state.teleponLama === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Nomor telepon harus berupa 10-15 digit angka
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Masukkan nomor telepon baru anda</Form.Label>
                  <Form.Control
                    className={
                      this.state.regexNomorTelepon.test(
                        this.state.teleponBaru
                      ) || this.state.teleponBaru === ""
                        ? ""
                        : "masuk-email"
                    }
                    type="text"
                    onChange={event =>
                      this.setState({ teleponBaru: event.target.value })
                    }
                  />
                  {this.state.regexNomorTelepon.test(this.state.teleponBaru) ||
                  this.state.teleponBaru === "" ? (
                    <div></div>
                  ) : (
                    <Form.Text className="masuk-emailtext">
                      Nomor telepon harus berupa 10-15 digit angka
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
                      !this.state.regexNomorTelepon.test(
                        this.state.teleponLama
                      ) ||
                      this.state.teleponLama === "" ||
                      !this.state.regexNomorTelepon.test(
                        this.state.teleponBaru
                      ) ||
                      this.state.teleponBaru === "" ||
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

export default withRouter(PerbaruiTelepon);
