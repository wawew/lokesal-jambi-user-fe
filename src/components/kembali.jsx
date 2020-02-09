import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";
import "../styles/kembali.css";

const Kembali = props => {
  return (
    <React.Fragment>
      <Container fluid className="kembali">
        <Row>
          <Col className="kembali-col">
            <div
              className="kembali-div"
              onClick={() => props.history.push(props.path)}
            >
              <span className="kembali-icon">
                <FaChevronLeft />
              </span>
              <span className="kembali-nama"> Kembali</span>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default withRouter(Kembali);
