import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/notFound.css";

const NotFound = props => {
  return (
    <Container className="notfound">
      <Row>
        <Col>
          <h1>404</h1>
          <h2>Maaf, halaman yang anda cari tidak ada</h2>
          <h3>
            Kembali ke{" "}
            <span onClick={() => props.history.push("/")}>Beranda</span>
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(NotFound);
