import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import swal from "sweetalert";
import Navbar from "../components/navbar";
import "../styles/kembali.css";
import { FaSignOutAlt } from "react-icons/fa";

class Profil extends React.Component {
  componentDidMount = () => {
    if (localStorage.getItem("token") === null) {
      this.props.history.push("/masuk");
    }
  };

  keluar = () => {
    swal({
      title: "Anda yakin mau keluar?",
      icon: "warning",
      buttons: ["Tidak", "Ya"],
      dangerMode: "Ya"
    }).then(willDelete => {
      if (willDelete) {
        localStorage.removeItem("token");
        localStorage.removeItem("terverifikasi");
        this.props.history.push("/masuk");
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <Container fluid className="kembali profil-kembali">
          <Row>
            <Col className="kembali-col">
              <div
                className="kembali-div profil-keluar"
                onClick={() => this.keluar()}
              >
                <span className="kembali-icon">
                  <FaSignOutAlt />
                </span>
                <span className="kembali-nama"> Keluar</span>
              </div>
            </Col>
          </Row>
        </Container>
        <Navbar beranda={false} laporan={false} berita={false} profil={true} />
      </React.Fragment>
    );
  }
}

export default withRouter(Profil);
