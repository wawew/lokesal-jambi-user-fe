import React from 'react';
import MainRoute from './route/MainRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import './styles/style.css';

function App() {
  return (
    <Container fluid>
      <Row>
        <Col className="style style-padding">
          <MainRoute />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
