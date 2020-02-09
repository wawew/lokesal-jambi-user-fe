import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { store } from "../store/store";
import "../styles/navbar.css";
import {
  FaHome,
  FaListAlt,
  FaFileSignature,
  FaNewspaper,
  FaSignInAlt,
  FaUserCircle
} from "react-icons/fa";
import swal from "sweetalert";

const Navbar = props => {
  const buttonKeluhkan = () => {
    if (localStorage.getItem("token") === null) {
      swal({
        title: "Anda belum masuk!",
        text:
          "Untuk melaporkan keluhan, anda diharuskan masuk sebagai pengguna.",
        icon: "error"
      });
    } else if (localStorage.getItem("terverifikasi") === "false") {
      const request = {
        method: "get",
        url: `${store.getState().urlBackend}/pengguna/profil`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      };
      axios(request).then(response => {
        if (response.data.terverifikasi === true) {
          localStorage.setItem("terverifikasi", "true");
          store.setState({
            lng: 0,
            lat: 0,
            isiKeluhan: "",
            anonim: false,
            foto: null,
            uriFoto: "",
            linkFoto: "",
            namaFoto: ""
          });
          props.history.push("/keluhkan");
        } else {
          swal({
            title: "Anda belum terverifikasi!",
            text:
              "Silahkan mengunggah foto KTP anda untuk mengajukan verifikasi.",
            icon: "error"
          });
        }
      });
    } else {
      store.setState({
        lng: 0,
        lat: 0,
        isiKeluhan: "",
        anonim: false,
        foto: null,
        uriFoto: "",
        linkFoto: "",
        namaFoto: ""
      });
      props.history.push("/keluhkan");
    }
  };

  return (
    <Container fluid className="navbar">
      <button className="navbar-button" onClick={() => buttonKeluhkan()}>
        <h5>
          <FaFileSignature />
        </h5>
      </button>
      <Row className="navbar-row">
        <Col
          className={props.beranda ? "navbar-color" : ""}
          onClick={() => props.history.push("/")}
        >
          <h5>
            <FaHome />
          </h5>
          <h6>Beranda</h6>
        </Col>
        <Col
          className={props.laporan ? "navbar-color" : ""}
          onClick={() => props.history.push("/laporan")}
        >
          <h5>
            <FaListAlt />
          </h5>
          <h6>Laporan</h6>
        </Col>
        <Col>
          <h5 className="navbar-hidden">
            <FaFileSignature />
          </h5>
          <h6>Keluhkan</h6>
        </Col>
        <Col className={props.berita ? "navbar-color" : ""}>
          <h5>
            <FaNewspaper />
          </h5>
          <h6>Berita</h6>
        </Col>
        {localStorage.getItem("token") !== null ? (
          <Col
            className={props.profil ? "navbar-color" : ""}
            onClick={() => props.history.push("/profil")}
          >
            <h5>
              <FaUserCircle />
            </h5>
            <h6>Profil</h6>
          </Col>
        ) : (
          <Col onClick={() => props.history.push("/masuk")}>
            <h5>
              <FaSignInAlt />
            </h5>
            <h6>Masuk</h6>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default withRouter(Navbar);
