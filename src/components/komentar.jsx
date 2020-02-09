import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/komentar.css";
import { FaUserCircle } from "react-icons/fa";
import moment from "moment";
import "moment-timezone";
import "moment/locale/id";

const Komentar = props => {
  return (
    <Container className="komentar">
      <Container fluid className="komentar-border">
        <Row>
          <Col xs="auto" className="komentar-avatar">
            {props.avatar === "" ? (
              <div className="komentar-avatarkosong">
                <FaUserCircle />
              </div>
            ) : (
              <img alt="avatar" src={props.avatar} />
            )}
          </Col>
          <Col className="komentar-isi">
            <h3>
              {props.namaDepan} {props.namaBelakang}
            </h3>
            <p className="komentar-kata">{props.isi}</p>
            <p className="komentar-waktu">
              {moment(
                moment(`${props.dibuat}Z`)
                  .tz("Asia/Jakarta")
                  .format(),
                ""
              ).fromNow()}{" "}
              &#8226; Laporkan
            </p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Komentar;
