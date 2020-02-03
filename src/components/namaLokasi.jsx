import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';

const NamaLokasi = props => {
  return (
    <Container fluid className="namalokasi">
      <Row>
        <Col xs="auto" className="namalokasi-icon">
          <FaMapMarkerAlt />
        </Col>
        <Col>
          <h6>{props.lokasi}</h6>
        </Col>
      </Row>
    </Container>
  );
}

export default NamaLokasi;
