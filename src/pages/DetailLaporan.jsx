import React from "react";
import axios from "axios";
import { store, actions } from "../store/store";
import moment from "moment";
import "moment-timezone";
import "moment/locale/id";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import {
  FaChevronLeft,
  FaCircle,
  FaUser,
  FaRegCalendarAlt,
  FaHeadset,
  FaImage,
  FaHandsHelping,
  FaComments
} from "react-icons/fa";
import "../styles/kembali.css";
import "../styles/detailLaporan.css";
import NamaLokasi from "../components/namaLokasi";
import { connect } from "unistore/react";

class DetailLaporan extends React.Component {
  state = {
    fotoSebelum: "",
    fotoSesudah: "",
    status: "",
    namaDepan: "",
    namaBelakang: "",
    anonim: false,
    isi: "",
    totalDukungan: 0,
    totalKomentar: 0,
    tanggapanAdmin: [],
    dibuat: "",
    diperbarui: "",
    loading: false
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    // Get data detail keluhan
    const request = {
      method: "get",
      url: `${store.getState().urlBackend}/keluhan/${
        this.props.match.params.id
      }?kota=${store.getState().namaKota}`,
      headers: { "Content-Type": "application/json" }
    };
    axios(request)
      .then(response => {
        console.log(response.data);
        this.setState({
          fotoSebelum: response.data.foto_sebelum,
          fotoSesudah: response.data.foto_sesudah,
          status: response.data.status,
          namaDepan: response.data.nama_depan,
          namaBelakang: response.data.nama_belakang,
          anonim: response.data.anonim,
          isi: response.data.isi,
          totalDukungan: response.data.total_dukungan,
          totalKomentar: response.data.total_komentar,
          tanggapanAdmin: response.data.tanggapan_admin,
          dibuat: response.data.dibuat,
          diperbarui: response.data.diperbarui,
          loading: false
        });
        this.props.getLokasi([response.data.longitude, response.data.latitude]);
      })
      .catch(() => this.setState({ loading: false }));
  };

  render() {
    return (
      <React.Fragment>
        <Container fluid className="kembali">
          <Row>
            <Col className="kembali-col">
              <div
                className="kembali-div"
                onClick={() => this.props.history.goBack()}
              >
                <span className="kembali-icon">
                  <FaChevronLeft />
                </span>
                <span className="kembali-nama"> Kembali</span>
              </div>
            </Col>
          </Row>
        </Container>
        {this.state.loading ? (
          <Container fluid className="detaillaporan-loading">
            <Row>
              <Col>
                <Spinner variant="success" animation="grow" />
              </Col>
            </Row>
          </Container>
        ) : (
          <React.Fragment>
            <Container fluid className="detaillaporan-fotosebelum">
              <Row>
                <Col>
                  {this.state.fotoSebelum === "" ? (
                    <div className="detaillaporan-fotosebelum-foto">
                      <FaImage />
                    </div>
                  ) : (
                    <img alt="foto sebelum" src={this.state.fotoSebelum} />
                  )}
                </Col>
              </Row>
            </Container>
            <Container fluid className="detaillaporan-status">
              <Row>
                {this.state.status === "diterima" ? (
                  <Col>
                    <div
                      className="detaillaporan-status-lingkaran"
                      style={{ color: "red" }}
                    >
                      <FaCircle />
                    </div>{" "}
                    Keluhan Diterima
                  </Col>
                ) : this.state.status === "diproses" ? (
                  <Col>
                    <div
                      className="detaillaporan-status-lingkaran"
                      style={{ color: "rgb(255, 180, 0)" }}
                    >
                      <FaCircle />
                    </div>{" "}
                    Sedang Diproses
                  </Col>
                ) : (
                  <Col>
                    <div
                      className="detaillaporan-status-lingkaran"
                      style={{ color: "green" }}
                    >
                      <FaCircle />
                    </div>{" "}
                    Laporan Selesai
                  </Col>
                )}
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
              <NamaLokasi lokasi={this.props.lokasiUser} />
            )}
            <Container fluid className="detaillaporan-keluhan">
              <Row>
                <Col>
                  <div className="detaillaporan-keluhan-icon">
                    <FaUser />
                  </div>{" "}
                  {this.state.anonim
                    ? "Anonim"
                    : `${this.state.namaDepan} ${this.state.namaBelakang}`}
                </Col>
              </Row>
              <Row>
                <Col style={{ fontWeight: "normal" }}>
                  <div className="detaillaporan-keluhan-icon">
                    <FaRegCalendarAlt />
                  </div>{" "}
                  {moment(`${this.state.dibuat}Z`)
                    .tz("Asia/Jakarta")
                    .format("LL")}{" "}
                  {moment(`${this.state.dibuat}Z`).format("HH:mm")} WIB
                </Col>
              </Row>
              <Row className="detaillaporan-isi">
                <Col>{this.state.isi}</Col>
              </Row>
            </Container>
            {this.state.status === "diproses" ||
            this.state.status === "selesai" ? (
              <Container fluid className="detaillaporan-keluhan">
                <Row>
                  <Col>
                    <div className="detaillaporan-keluhan-icon">
                      <FaHeadset />
                    </div>{" "}
                    Tanggapan Admin
                  </Col>
                </Row>
                <Row>
                  <Col style={{ fontWeight: "normal" }}>
                    <div className="detaillaporan-keluhan-icon">
                      <FaRegCalendarAlt />
                    </div>{" "}
                    {moment(`${this.state.diperbarui}Z`)
                      .tz("Asia/Jakarta")
                      .format("LL")}{" "}
                    {moment(`${this.state.diperbarui}Z`).format("HH:mm")} WIB
                  </Col>
                </Row>
                <Row className="detaillaporan-isi">
                  <Col>{this.state.isi}</Col>
                </Row>
              </Container>
            ) : (
              <div></div>
            )}
          </React.Fragment>
        )}
        <Container fluid className="detaillaporan-dukungan">
          <Row>
            <Col>
              <div className="detaillaporan-dukungan-icon">
                <FaHandsHelping />
              </div>{" "}
              {this.state.totalDukungan} dukungan
            </Col>
            <Col xs="auto">
              <div className="detaillaporan-keluhan-icon">
                <FaComments />
              </div>{" "}
              {this.state.totalKomentar} komentar
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
)(withRouter(DetailLaporan));
