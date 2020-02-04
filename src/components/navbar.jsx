import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/navbar.css';
import { FaHome, FaListAlt, FaFileSignature, FaNewspaper, FaSignInAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = props => {
  return (
    <Container fluid>
      <button
        className="navbar-button"
        onClick={() => props.history.push("/keluhkan")}
        disabled={localStorage.getItem('token') === null ? true : false}
      >
        <h5><FaFileSignature /></h5>
      </button>
      <Row className="navbar-row">
        <Col
          className={props.beranda ? "navbar-color" : ""}
          onClick={() => props.history.push("/")}
        >
          <h5><FaHome /></h5>
          <h6>Beranda</h6>
        </Col>
        <Col className={props.laporan ? "navbar-color" : ""}>
          <h5><FaListAlt /></h5>
          <h6>Laporan</h6>
        </Col>
        <Col>
          <h5 className="navbar-hidden"><FaFileSignature /></h5>
          <h6>Keluhkan</h6>
        </Col>
        <Col className={props.berita ? "navbar-color" : ""}>
          <h5><FaNewspaper /></h5>
          <h6>Berita</h6>
        </Col>
        {
          localStorage.getItem("token") !== null ?
          (
            <Col
              className={props.profil ? "navbar-color" : ""}
              onClick={() => props.history.push("/profil")}
            >
              <h5><FaUserCircle /></h5>
              <h6>Profil</h6>
            </Col>
          )
          : (
            <Col onClick={() => props.history.push("/masuk")}>
              <h5><FaSignInAlt /></h5>
              <h6>Masuk</h6>
            </Col>
          )
        }
      </Row>
    </Container>
  );
}

export default withRouter(Navbar);
