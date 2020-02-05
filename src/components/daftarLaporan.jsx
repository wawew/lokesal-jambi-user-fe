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
  FaCircle
} from "react-icons/fa";

class DaftarLaporan extends React.Component {
  state = {
    lokasi: "",
    loading: false
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    const request = {
      method: "get",
      url: `${store.getState().mapboxUrl}${this.props.longitude},${
        this.props.latitude
      }.json?access_token=${store.getState().mapboxKey}`,
      headers: { "Content-Type": "application/json" }
    };
    axios(request).then(response => {
      this.setState({
        lokasi: response.data.features[0].place_name,
        loading: false
      });
    });
  };

  render() {
    return (
      <Container fluid className="daftarlaporan">
        <Row>
          <Col xs="auto" className="daftarlaporan-col">
            <img alt="foto" src={this.props.foto_sebelum} />
          </Col>
          <Col className="daftarlaporan-data">
            <h1>
              <div className="daftarlaporan-icon">
                <FaUser />
              </div>{" "}
              {this.props.nama_depan} {this.props.nama_belakang}
            </h1>
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
                .format("LL")}{" "}
              {moment(`${this.props.dibuat}Z`).format("hh:mm")} WIB
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
