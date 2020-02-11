import React from "react";
import axios from "axios";
import swal from "sweetalert";
import { store } from "../store/store";
import { Container, Row, Col, Form, Spinner, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Kembali from "../components/kembali";

class PerbaruiNama extends React.Component {
  state = {
    namaDepan: "",
    namaBelakang: "",
    loading: false
  };

  perbarui = () => {
    this.setState({ loading: true });
    const request = {
      method: "put",
      url: `${store.getState().urlBackend}/pengguna/profil`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      data: {
        nama_depan: this.state.namaDepan,
        nama_belakang: this.state.namaBelakang
      }
    };
    axios(request)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push("/profil");
      })
      .catch(() => {
        this.setState({ loading: false });
        swal("Perbarui nama gagal!", "Silahkan coba lagi.", "error");
      });
  };

  render() {
    return (
      <React.Fragment>
        <Kembali path="/profil" />
        <Container fluid className="profil-perbaruinama">
          <Row>
            <Col>
              <h2>Perbarui Nama</h2>
              <Form
                onSubmit={event => event.preventDefault()}
                className="profil-perbarui-form"
              >
                <Form.Group>
                  <Form.Label>Masukkan nama depan anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ namaDepan: event.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Masukkan nama belakang anda</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={event =>
                      this.setState({ namaBelakang: event.target.value })
                    }
                  />
                </Form.Group>
                {this.state.loading ? (
                  <div className="profil-perbarui-spinner">
                    <Spinner animation="grow" variant="success" />
                  </div>
                ) : (
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.perbarui()}
                    disabled={
                      this.state.namaDepan === "" ||
                      this.state.namaBelakang === ""
                        ? true
                        : false
                    }
                  >
                    Perbarui
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(PerbaruiNama);
