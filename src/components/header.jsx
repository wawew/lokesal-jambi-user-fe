import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/header.css";
import { store } from "../store/store";
import logo from "../images/logo-kota-jambi.jpg";

const Header = () => {
  return (
    <Container fluid className="header">
      <Row>
        <Col xs="auto" className="header-image">
          <img alt="logo" src={logo} />
        </Col>
        <Col xs="auto" className="style-padding"></Col>
        <Col className="header-title">
          <h1>Kota {store.getState().namaKota}</h1>
          <p>{store.getState().tajukKota}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
