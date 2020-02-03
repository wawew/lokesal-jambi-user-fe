import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/namaLokasi.css';

const NamaLokasi = props => {
  return (
    <Container fluid className="namalokasi">
      <Row>
        <Col xs="auto" className="namalokasi-icon">
          <FaMapMarkerAlt />
        </Col>
        <Col className="namalokasi-nama">
          {props.lokasi}
        </Col>
      </Row>
    </Container>
  );
}

export default NamaLokasi;
