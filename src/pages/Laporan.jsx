import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { store } from '../store/store';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Header from '../components/header';
import Navbar from '../components/navbar';
import '../styles/laporan.css';

class Laporan extends React.Component {
  state = {
    totalDiterima: 0,
    totalDiproses: 0,
    totalSelesai: 0,
    loadingTotal: false
  }

  componentDidMount = () => {
    this.setState({loadingTotal: true})
    const request = {
      method: 'get',
      url: `${store.getState().urlBackend}/total_keluhan?kota=${store.getState().namaKota}`,
      headers: {'Content-Type': 'application/json'}
    }
    axios(request)
      .then(response => {
        this.setState({
          totalDiterima: response.data.diterima,
          totalDiproses: response.data.diproses,
          totalSelesai: response.data.selesai,
          loadingTotal: false
        })
      })
      .catch(() => {
        this.setState({loadingTotal: false})
      })
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Navbar beranda={false} laporan={true} berita={false} profil={false} />
        <Container className="laporan-total">
          <Row>
            <Col className="laporan-total-kiri">
              {
                this.state.loadingTotal
                ? <Spinner className="laporan-total-spinner" animation="grow" variant="success" />
                : <div>
                  <h3>{this.state.totalDiterima}</h3>
                  <h6>Keluhan Diterima</h6>
                </div>
              }
            </Col>
            <Col className="laporan-total-tengah">
              {
                this.state.loadingTotal
                ? <Spinner className="laporan-total-spinner" animation="grow" variant="success" />
                : <div>
                  <h3>{this.state.totalDiproses}</h3>
                  <h6>Sedang Diproses</h6>
                </div>
              }
            </Col>
            <Col className="laporan-total-kanan">
              {
                this.state.loadingTotal
                ? <Spinner className="laporan-total-spinner" animation="grow" variant="success" />
                : <div>
                  <h3>{this.state.totalSelesai}</h3>
                  <h6>Laporan Selesai</h6>
                </div>
              }
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default withRouter(Laporan);
