import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { store } from '../store/store';
import Kembali from '../components/kembali';
import NamaLokasi from '../components/namaLokasi';
import { Form, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import '../styles/cariLokasi.css';
import { FaSearchLocation, FaSadTear } from 'react-icons/fa';

class CariLokasi extends React.Component {
  state = {
    kataKunci: "",
    hasilPencarian: "",
    loading: false
  }

  cariLokasi = () => {
    this.setState({loading: true});
    const request = {
      method: 'get',
      url: `${store.getState().mapboxUrl}${this.state.kataKunci}.json?access_token=${store.getState().mapboxKey}`,
      headers: {'Content-Type': 'application/json'}
    }
    axios(request)
      .then(response => {
        this.setState({
          hasilPencarian: response.data.features,
          loading: false
        })
      })
      .catch(() => {
        this.setState({
          hasilPencarian: [],
          loading: false
        })
      })
  }

  render() {
    return (
      <React.Fragment>
        <Kembali />
        <Container fluid className="carilokasi">
          <Row>
            <Col>
              <Form onSubmit={event => event.preventDefault()}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Cari Lokasi"
                    onChange={event => this.setState({kataKunci: event.target.value})}
                  />
                </Form.Group>
                <Button type="submit" onClick={() => this.cariLokasi()}>
                  Cari
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
        <Container fluid className="carilokasi-hasil">
          <Row>
            <Col>
              {
                this.state.loading ?
                <div className="carilokasi-loading">
                  <Spinner animation="grow" variant="success" />
                </div>
                : this.state.hasilPencarian === "" ? 
                <div className="carilokasi-awal">
                  <h5><FaSearchLocation /></h5>
                  <h6>Cari Lokasi Masalah yang Ingin Anda Laporkan</h6>
                </div>
                : this.state.hasilPencarian.length === 0 ?
                <div className="carilokasi-awal">
                  <h5><FaSadTear /></h5>
                  <h6>Lokasi yang Kamu Cari Tidak Ditemukan</h6>
                </div>
                :
                <React.Fragment>
                  {this.state.hasilPencarian.map(item => {
                    return (
                      <div className="carilokasi-daftarhasil">
                        <NamaLokasi lokasi={item.place_name} />
                      </div>
                    )
                  })}
                </React.Fragment>
              }
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default withRouter(CariLokasi);
