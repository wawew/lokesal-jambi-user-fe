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
    daftarLaporan: [
      {
        nama_depan: "Wildan",
        nama_belakang: "Firdaussssssssssssssssssss",
        detail_keluhan: {
          id: 1,
          dibuat: "2020-02-04T23:33:00",
          diperbarui: "2020-02-04T23:33:00",
          foto_sebelum:
            "https://imgx.gridoto.com/crop/0x0:0x0/700x465/photo/gridoto/2017/10/06/1411809991.jpg",
          longitude: "112",
          latitude: "-7",
          isi: "Keluhanku adalah itu pokoknya",
          total_dukungan: 0,
          total_komentar: 0,
          status: "diterima"
        }
      },
      {
        nama_depan: "Wildan",
        nama_belakang: "Firdaus",
        detail_keluhan: {
          id: 2,
          dibuat: "2020-02-04T23:33:00",
          diperbarui: "2020-02-04T23:33:00",
          foto_sebelum:
            "https://imgx.gridoto.com/crop/0x0:0x0/700x465/photo/gridoto/2017/10/06/1411809991.jpg",
          longitude: "0",
          latitude: "0",
          isi: "Keluhanku adalah itu pokoknya",
          total_dukungan: 0,
          total_komentar: 0,
          status: "diproses"
        }
      },
      {
        nama_depan: "Wildan",
        nama_belakang: "Firdaus",
        detail_keluhan: {
          id: 3,
          dibuat: "2020-02-04T23:33:00",
          diperbarui: "2020-02-04T23:33:00",
          foto_sebelum:
            "https://imgx.gridoto.com/crop/0x0:0x0/700x465/photo/gridoto/2017/10/06/1411809991.jpg",
          longitude: "0",
          latitude: "0",
          isi: "Keluhanku adalah itu pokoknya",
          total_dukungan: 0,
          total_komentar: 0,
          status: "selesai"
        }
      }
    ],
    loadingDaftarLaporan: false
  };

  componentDidMount = () => {
    this.setState({
      loadingTotal: true,
      loadingDaftarLaporan: true,
      loadingDaftarLokasi: true
    });
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
            <Col xs="auto">
              <h6 onClick={() => this.props.history.push("/keluhanku")}>
                Keluhanku
              </h6>
            </Col>
          </Row>
          {this.state.daftarLaporan.map(item => {
            return (
              <DaftarLaporan
                id={item.detail_keluhan.id}
                foto_sebelum={item.detail_keluhan.foto_sebelum}
                nama_depan={item.nama_depan}
                nama_belakang={item.nama_belakang}
                longitude={item.detail_keluhan.longitude}
                latitude={item.detail_keluhan.latitude}
                dibuat={item.detail_keluhan.dibuat}
                status={item.detail_keluhan.status}
              />
            );
          })}
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Laporan);
