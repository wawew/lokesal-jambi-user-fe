import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
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
  return (
    <Container fluid className="navbar">
      <button
        className="navbar-button"
        onClick={() => {
          localStorage.getItem("token") === null
            ? swal({
                title: "Anda belum masuk!",
                text:
                  "Untuk melaporkan keluhan, anda diharuskan masuk sebagai pengguna",
                icon: "error"
              })
            : localStorage.getItem("terverifikasi") === "false"
            ? swal({
                title: "Anda belum terverifikasi!",
                text:
                  "Silahkan mengunggah foto KTP anda untuk mengajukan verifikasi",
                icon: "error"
              })
            : props.history.push("/keluhkan");
        }}
      >
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
