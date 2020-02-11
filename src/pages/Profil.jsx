import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { store } from "../store/store";
import swal from "sweetalert";
import Navbar from "../components/navbar";
import "../styles/kembali.css";
import "../styles/profil.css";
import { FaSignOutAlt, FaUserCircle, FaEdit, FaCamera } from "react-icons/fa";

class Profil extends React.Component {
  state = {
    avatar: "",
    namaDepan: "",
    namaBelakang: "",
    email: "",
    telepon: "",
    terverifikasi: false,
    loading: false
  };

  componentDidMount = () => {
    if (localStorage.getItem("token") === null) {
      this.props.history.push("/masuk");
    } else {
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
          this.setState({
            avatar: response.data.avatar,
            namaDepan: response.data.nama_depan,
            namaBelakang: response.data.nama_belakang,
            email: response.data.email,
            telepon: response.data.telepon,
            terverifikasi: response.data.terverifikasi,
            loading: false
          });
        })
        .catch(() => this.setState({ loading: false }));
    }
  };

  keluar = () => {
    swal({
      title: "Anda yakin mau keluar?",
      icon: "warning",
      buttons: ["Tidak", "Ya"],
      dangerMode: "Ya"
    }).then(willDelete => {
      if (willDelete) {
        localStorage.removeItem("token");
        localStorage.removeItem("terverifikasi");
        this.props.history.push("/masuk");
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <Container fluid className="kembali profil-kembali">
          <Row>
            <Col className="kembali-col">
              <div
                className="kembali-div profil-keluar"
                onClick={() => this.keluar()}
              >
                <span className="kembali-icon">
                  <FaSignOutAlt />
                </span>
                <span className="kembali-nama"> Keluar</span>
              </div>
            </Col>
          </Row>
        </Container>
        {this.state.loading ? (
          <Container fluid className="profil-loading">
            <Row>
              <Col>
                <Spinner variant="success" animation="grow" />
              </Col>
            </Row>
          </Container>
        ) : (
          <div>
            {this.state.terverifikasi ? (
              <div className="profil-verifikasi-true"></div>
            ) : (
              <Container fluid className="profil-verifikasi-false">
                <Row>
                  <Col>
                    <p>
                      Akun anda belum terverifikasi. Unggah foto KTP anda untuk
                      mengajukan pengubahan status verifikasi akun anda. Jika
                      anda sudah mengunggah foto KTP anda dan dalam 24 jam akun
                      anda belum terverifikasi, hubungi kami di admin1@jambi.id.
                    </p>
                    <Button
                      variant="success"
                      onClick={() => this.props.history.push("/unggahktp")}
                    >
                      Unggah Foto KTP
                    </Button>
                  </Col>
                </Row>
              </Container>
            )}
            <Container fluid className="profil-foto">
              <Row>
                <Col></Col>
                <Col xs="auto">
                  {this.state.avatar === "" ? (
                    <div className="profil-foto-kosong">
                      <FaUserCircle />
                    </div>
                  ) : (
                    <img alt="foto" src={this.state.avatar} />
                  )}
                  <div
                    className="profil-unggahfoto bg-success"
                    onClick={() => this.props.history.push("/unggahfoto")}
                  >
                    <FaCamera />
                  </div>
                </Col>
                <Col></Col>
              </Row>
            </Container>
            <Container fluid className="profil-data">
              <Row>
                <Col>
                  Nama Lengkap{" "}
                  <div
                    className="profil-edit-button text-success"
                    onClick={() => this.props.history.push("/perbaruinama")}
                  >
                    <FaEdit />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>
                    {this.state.namaDepan} {this.state.namaBelakang}
                  </h3>
                </Col>
              </Row>
            </Container>
            <Container fluid className="profil-data">
              <Row>
                <Col>
                  Email{" "}
                  <div
                    className="profil-edit-button text-success"
                    onClick={() => this.props.history.push("/perbaruiemail")}
                  >
                    <FaEdit />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>{this.state.email}</h3>
                </Col>
              </Row>
            </Container>
            <Container fluid className="profil-data">
              <Row>
                <Col>
                  No. Telepon{" "}
                  <div
                    className="profil-edit-button text-success"
                    onClick={() => this.props.history.push("/perbaruitelepon")}
                  >
                    <FaEdit />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>{this.state.telepon}</h3>
                </Col>
              </Row>
            </Container>
            <Container fluid className="profil-data">
              <Row>
                <Col>
                  Password{" "}
                  <div
                    className="profil-edit-button text-success"
                    onClick={() => this.props.history.push("/perbaruipassword")}
                  >
                    <FaEdit />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>********</h3>
                </Col>
              </Row>
            </Container>
            <div className="profil-bottom"></div>
          </div>
        )}
        <Navbar beranda={false} laporan={false} berita={false} profil={true} />
      </React.Fragment>
    );
  }
}

export default withRouter(Profil);
