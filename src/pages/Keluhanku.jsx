import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { store } from "../store/store";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Kembali from "../components/kembali";
import DaftarLaporan from "../components/daftarLaporan";
import "../styles/laporan.css";

class Keluhanku extends React.Component {
  state = {
    daftarLaporan: [],
    halaman: 1,
    totalHalaman: 1,
    loadingLaporan: false,
    loadingSelanjutnya: false
  };

  lihatLaporanSebelumnya = () => {
    this.setState({ loadingSelanjutnya: true });
    const requestLaporan = {
      method: "get",
      url: `${store.getState().urlBackend}/pengguna/keluhan?halaman=${this.state
        .halaman + 1}&per_halaman=5`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
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
      loadingLaporan: true
    });
    const request = {
      method: "get",
      url: `${
        store.getState().urlBackend
      }/pengguna/keluhan?halaman=1&per_halaman=5`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    };
    axios(request)
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
        <Kembali path="/laporan" />
        <Container fluid className="keluhanku">
          <h1>RIWAYAT KELUHANKU</h1>
          {this.state.loadingLaporan ? (
            <Container className="laporan-daftar-spinner keluhanku-spinner">
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
                  id={item.id}
                  foto_sebelum={item.foto_sebelum}
                  nama_depan={item.nama_depan}
                  nama_belakang={item.nama_belakang}
                  longitude={item.longitude}
                  latitude={item.latitude}
                  dibuat={item.dibuat}
                  status={item.status}
                  anonim={item.anonim}
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

export default withRouter(Keluhanku);
