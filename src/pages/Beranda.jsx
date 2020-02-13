import React from "react";
import axios from "axios";
import moment from "moment";
import "moment-timezone";
import "moment/locale/id";
import { store } from "../store/store";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "../styles/widget.css";
import "../styles/laporan.css";
import Header from "../components/header";
import Navbar from "../components/navbar";
import Widget from "../components/widget";
import DaftarLaporan from "../components/daftarLaporan";

class Beranda extends React.Component {
  state = {
    cuaca: "",
    suhu: "",
    kelembapan: "",
    loadingWidget: false,
    daftarBerita: [],
    loadingBerita: false,
    daftarLaporan: [],
    loadingLaporan: false
  };

  componentDidMount = () => {
    this.setState({
      loadingWidget: true,
      loadingLaporan: true,
      loadingBerita: true
    });

    // Get data untuk widget
    const request = {
      method: "get",
      url: `${store.getState().weatherUrl}?APPID=${
        store.getState().weatherKey
      }&q=${store.getState().namaKota}&units=metric`,
      headers: { "Content-Type": "application/json" }
    };
    axios(request).then(response => {
      this.setState({
        cuaca: response.data.weather[0].icon,
        suhu: response.data.main.temp,
        kelembapan: response.data.main.humidity,
        loadingWidget: false
      });
    });

    // Get data untuk keluhan
    const requestLaporan = {
      method: "get",
      url: `${store.getState().urlBackend}/keluhan?kota=${
        store.getState().namaKota
      }&halaman=1&per_halaman=3`,
      headers: { "Content-Type": "application/json" }
    };
    axios(requestLaporan)
      .then(response => {
        this.setState({
          daftarLaporan: response.data.daftar_keluhan,
          loadingLaporan: false
        });
      })
      .catch(() => this.setState({ loadingLaporan: false }));

    // Get data untuk berita
    const requestBerita = {
      method: "get",
      url: `${store.getState().newsApiUrl}${store.getState().newsApiKey}`,
      headers: { "Content-Type": "application/json" }
    };
    axios(requestBerita)
      .then(response => {
        this.setState({
          daftarBerita: response.data.articles,
          loadingBerita: false
        });
      })
      .catch(() => this.setState({ loadingBerita: false }));
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <Navbar beranda={true} laporan={false} berita={false} profil={false} />
        <Container className="widget">
          <Row>
            <Col className="widget-left">
              {this.state.loadingWidget ? (
                <Spinner
                  className="widget-spinner"
                  animation="grow"
                  variant="success"
                />
              ) : (
                <Widget tipe="cuaca" data={this.state.cuaca} />
              )}
            </Col>
            <Col>
              {this.state.loadingWidget ? (
                <Spinner
                  className="widget-spinner"
                  animation="grow"
                  variant="success"
                />
              ) : (
                <Widget tipe="suhu" data={this.state.suhu} />
              )}
            </Col>
            <Col className="widget-right">
              {this.state.loadingWidget ? (
                <Spinner
                  className="widget-spinner"
                  animation="grow"
                  variant="success"
                />
              ) : (
                <Widget tipe="kelembapan" data={this.state.kelembapan} />
              )}
            </Col>
          </Row>
        </Container>
        <Container
          fluid
          className="laporan-daftar"
          style={{ paddingBottom: "5px" }}
        >
          <Row>
            <Col>
              <h2>LAPORAN TERKINI</h2>
            </Col>
            <Col xs="auto">
              <h6 onClick={() => this.props.history.push("/laporan")}>
                Lihat Semua
              </h6>
            </Col>
          </Row>
          {this.state.loadingLaporan ? (
            <Container
              className="laporan-daftar-spinner"
              style={{ paddingTop: "15px", paddingBottom: "15px" }}
            >
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
        </Container>
        <Container fluid className="laporan-daftar">
          <Row>
            <Col>
              <h2>BERITA TERKINI</h2>
            </Col>
            <Col xs="auto">
              <h6 onClick={() => this.props.history.push("/berita")}>
                Lihat Semua
              </h6>
            </Col>
          </Row>
          {this.state.loadingBerita ? (
            <Container className="laporan-daftar-spinner">
              <Row>
                <Col>
                  <Spinner animation="grow" variant="success" />
                </Col>
              </Row>
            </Container>
          ) : (
            this.state.daftarBerita.slice(0, 1).map(item => {
              return (
                <a href={item.url}>
                  <Container
                    style={{
                      borderTop: "solid 1px rgb(220, 220, 220)"
                    }}
                  >
                    <Row style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                      <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <img
                          alt="foto berita"
                          src={item.urlToImage}
                          style={{
                            maxHeight: "150px",
                            objectFit: "cover",
                            width: "100%",
                            borderRadius: "10px"
                          }}
                        />
                        <h2
                          style={{
                            marginTop: "15px",
                            marginBottom: "10px",
                            color: "rgb(80, 120, 80)"
                          }}
                        >
                          {item.title}
                        </h2>
                        <p style={{ marginBottom: "5px", color: "black" }}>
                          {item.description}
                        </p>
                        <p style={{ color: "gray", marginBottom: 0 }}>
                          {item.source.name} &bull;{" "}
                          {moment(item.publishedAt)
                            .tz("Asia/Jakarta")
                            .format("ll")}
                        </p>
                      </Col>
                    </Row>
                  </Container>
                </a>
              );
            })
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default Beranda;
