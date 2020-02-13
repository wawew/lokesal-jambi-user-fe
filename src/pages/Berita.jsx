import React from "react";
import axios from "axios";
import moment from "moment";
import "moment-timezone";
import "moment/locale/id";
import { store } from "../store/store";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "../styles/laporan.css";
import Header from "../components/header";
import Navbar from "../components/navbar";

class Berita extends React.Component {
  state = {
    daftarBerita: [],
    loadingBerita: false
  };

  componentDidMount = () => {
    this.setState({ loadingBerita: true });
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
        <Navbar beranda={false} laporan={false} berita={true} profil={false} />
        <Container fluid className="laporan-daftar" style={{ marginTop: 0 }}>
          <Row>
            <Col>
              <h2>BERITA TERKINI</h2>
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
            this.state.daftarBerita.map(item => {
              return (
                <a href={item.url}>
                  <Container
                    style={{ borderTop: "solid 1px rgb(220, 220, 220)" }}
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

export default Berita;
