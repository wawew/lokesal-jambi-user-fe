import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { store } from "../store/store";
import moment from "moment";
import "moment-timezone";
import "moment/locale/id";
import { Row, Col, Container } from "react-bootstrap";
import "../styles/daftarLaporan.css";
import {
  FaUser,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaCircle,
  FaImage
} from "react-icons/fa";

class DaftarLaporan extends React.Component {
  state = {
    lokasi: ""
  };

  componentDidMount = () => {
    const request = {
      method: "get",
      url: `${store.getState().mapboxUrl}${this.props.longitude},${
        this.props.latitude
      }.json?access_token=${store.getState().mapboxKey}`,
      headers: { "Content-Type": "application/json" }
    };
    axios(request).then(response => {
      this.setState({
        lokasi: response.data.features[0].place_name
      });
    });
  };

  render() {
    return (
      <Container
        fluid
        className="daftarlaporan"
        onClick={() => this.props.history.push(`/laporan/${this.props.id}`)}
      >
        <Row>
          <Col xs="auto" className="daftarlaporan-col">
            {this.props.foto_sebelum === "" ? (
              <div className="daftarlaporan-gambarkosong">
                <FaImage />
              </div>
            ) : this.props.status === "selesai" ? (
              <img alt="foto" src={this.props.foto_sesudah} />
            ) : (
              <img alt="foto" src={this.props.foto_sebelum} />
            )}
          </Col>
          <Col className="daftarlaporan-data">
            {this.props.nama_depan === undefined &&
            this.props.nama_belakang === undefined ? (
              <div className="daftarlaporan-riwayat"></div>
            ) : (
              <h1>
                <div className="daftarlaporan-icon">
                  <FaUser />
                </div>{" "}
                {this.props.anonim
                  ? "Anonim"
                  : `${this.props.nama_depan} ${this.props.nama_belakang}`}
              </h1>
            )}
            <h4>
              <div className="daftarlaporan-icon">
                <FaMapMarkerAlt />
              </div>{" "}
              {this.state.lokasi}
            </h4>
            <h3>
              <div className="daftarlaporan-icon">
                <FaRegCalendarAlt />
              </div>{" "}
              {moment(`${this.props.dibuat}Z`)
                .tz("Asia/Jakarta")
                .format("ll")}{" "}
              {moment(`${this.props.dibuat}Z`).format("HH:mm")} WIB
            </h3>
            <h2>
              <div
                className={
                  this.props.status === "diterima"
                    ? "daftarlaporan-diterima"
                    : this.props.status === "diproses"
                    ? "daftarlaporan-diproses"
                    : "daftarlaporan-selesai"
                }
              >
                <FaCircle />
              </div>{" "}
              {this.props.status === "diterima"
                ? "Keluhan Diterima"
                : this.props.status === "diproses"
                ? "Sedang Diproses"
                : "Laporan Selesai"}
            </h2>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(DaftarLaporan);
