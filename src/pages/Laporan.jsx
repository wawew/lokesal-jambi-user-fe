import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { store } from "../store/store";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Header from "../components/header";
import Navbar from "../components/navbar";
import DaftarLaporan from "../components/daftarLaporan";
import "../styles/laporan.css";

class Laporan extends React.Component {
  state = {
    totalDiterima: 0,
    totalDiproses: 0,
    totalSelesai: 0,
    loadingTotal: false,
    daftarLaporan: [],
    halaman: 1,
    totalHalaman: 1,
    loadingLaporan: false,
    loadingSelanjutnya: false
  };

  /**
   * Mendapatkan data laporan sebelumnya dari backend
   */
  lihatLaporanSebelumnya = () => {
    this.setState({ loadingSelanjutnya: true });
    const requestLaporan = {
      method: "get",
      url: `${store.getState().urlBackend}/keluhan?kota=${
        store.getState().namaKota
      }&halaman=${this.state.halaman + 1}&per_halaman=5`,
      headers: { "Content-Type": "application/json" }
    };
    axios(requestLaporan)
      .then(response => {
        this.setState({
          halaman: response.data.halaman,
          totalHalaman: response.data.total_halaman,
          daftarLaporan: this.state.daftarLaporan.concat(
            response.data.daftar_keluhan
          ),
          loadingSelanjutnya: false
        });
      })
      .catch(() => this.setState({ loadingSelanjutnya: false }));
  };

  componentDidMount = () => {
    this.setState({
      loadingTotal: true,
      loadingLaporan: true
    });
    // Get total laporan diterima, diproses, dan selesai
    const request = {
      method: "get",
      url: `${store.getState().urlBackend}/total_keluhan?kota=${
        store.getState().namaKota
      }`,
      headers: { "Content-Type": "application/json" }
    };
    axios(request)
      .then(response => {
        this.setState({
          totalDiterima: response.data.diterima,
          totalDiproses: response.data.diproses,
          totalSelesai: response.data.selesai,
          loadingTotal: false
        });
      })
      .catch(() => {
        this.setState({ loadingTotal: false });
      });
    // Get daftar laporan
    const requestLaporan = {
      method: "get",
      url: `${store.getState().urlBackend}/keluhan?kota=${
        store.getState().namaKota
      }&halaman=1&per_halaman=5`,
      headers: { "Content-Type": "application/json" }
    };
    axios(requestLaporan)
      .then(response => {
        this.setState({
          halaman: response.data.halaman,
          totalHalaman: response.data.total_halaman,
          daftarLaporan: response.data.daftar_keluhan,
          loadingLaporan: false
        });
      })
      .catch(() => this.setState({ loadingLaporan: false }));
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <Navbar beranda={false} laporan={true} berita={false} profil={false} />
        <Container className="laporan-total">
          <Row>
            <Col className="laporan-total-kiri">
              {this.state.loadingTotal ? (
                <Spinner
                  className="laporan-total-spinner"
                  animation="grow"
                  variant="success"
                />
              ) : (
                <div>
                  <h3>{this.state.totalDiterima}</h3>
                  <h6>Keluhan Diterima</h6>
                </div>
              )}
            </Col>
            <Col className="laporan-total-tengah">
              {this.state.loadingTotal ? (
                <Spinner
                  className="laporan-total-spinner"
                  animation="grow"
                  variant="success"
                />
              ) : (
                <div>
                  <h3>{this.state.totalDiproses}</h3>
                  <h6>Sedang Diproses</h6>
                </div>
              )}
            </Col>
            <Col className="laporan-total-kanan">
              {this.state.loadingTotal ? (
                <Spinner
                  className="laporan-total-spinner"
                  animation="grow"
                  variant="success"
                />
              ) : (
                <div>
                  <h3>{this.state.totalSelesai}</h3>
                  <h6>Laporan Selesai</h6>
                </div>
              )}
            </Col>
          </Row>
        </Container>
        <Container fluid className="laporan-daftar">
          <Row>
            <Col>
              <h2>LAPORAN TERKINI</h2>
            </Col>
            {localStorage.getItem("token") === null ? (
              <div></div>
            ) : (
              <Col xs="auto">
                <h6 onClick={() => this.props.history.push("/keluhanku")}>
                  Keluhanku
                </h6>
              </Col>
            )}
          </Row>
          {this.state.loadingLaporan ? (
            <Container className="laporan-daftar-spinner">
              <Row>
                <Col>
                  <Spinner animation="grow" variant="success" />
                </Col>
              </Row>
            </Container>
          ) : (
            this.state.daftarLaporan.map(item => {
              return (
                <DaftarLaporan
                  id={item.detail_keluhan.id}
                  foto_sebelum={item.detail_keluhan.foto_sebelum}
                  foto_sesudah={item.detail_keluhan.foto_sesudah}
                  nama_depan={item.nama_depan}
                  nama_belakang={item.nama_belakang}
                  longitude={item.detail_keluhan.longitude}
                  latitude={item.detail_keluhan.latitude}
                  dibuat={item.detail_keluhan.dibuat}
                  status={item.detail_keluhan.status}
                  anonim={item.detail_keluhan.anonim}
                />
              );
            })
          )}
          {this.state.halaman === this.state.totalHalaman ||
          this.state.loadingLaporan ? (
            <div></div>
          ) : this.state.loadingSelanjutnya ? (
            <Row className="laporan-lihat">
              <Col>
                <Container>
                  <Spinner
                    className="laporan-lihat-spinner"
                    animation="grow"
                    variant="success"
                  />
                </Container>
              </Col>
            </Row>
          ) : (
            <Row className="laporan-lihat">
              <Col>
                <Container></Container>
                <span onClick={() => this.lihatLaporanSebelumnya()}>
                  Lihat laporan sebelumnya
                </span>
              </Col>
            </Row>
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Laporan);
