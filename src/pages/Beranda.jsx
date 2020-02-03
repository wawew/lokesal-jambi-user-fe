import React from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import '../styles/widget.css';
import { store } from '../store/store';
import Header from '../components/header';
import Navbar from '../components/navbar';
import Widget from '../components/widget';

class Beranda extends React.Component {
  state = {
    weatherUrl: "https://api.openweathermap.org/data/2.5/weather",
    weatherKey: "c33251a944689778c3962d353d4c0fb6",
    cuaca: "",
    suhu: "",
    kelembapan: "",
    loadingWidget: true,
    daftarBerita: [],
    loadingBerita: true
  }

  componentDidMount = () => {
    // Get data untuk widget
    const request = {
      method: 'get',
      url: `${this.state.weatherUrl}?APPID=${this.state.weatherKey}&q=${store.getState().namaKota}&units=metric`,
      headers: {'Content-Type': 'application/json'}
    }
    axios(request)
      .then(response => {
        this.setState({
          cuaca: response.data.weather[0].icon,
          suhu: response.data.main.temp,
          kelembapan: response.data.main.humidity,
          loadingWidget: false
        })
      })
    // Get data untuk berita
    this.setState({
      daftarBerita: [],
      loadingBerita: false
    })
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Navbar beranda={true} laporan={false} berita={false} profil={false} />
        <Container className="widget">
          <Row>
            <Col className="widget-left">
              {this.state.loadingWidget ? <Spinner className="widget-spinner" animation="grow" variant="success" /> : <Widget tipe="cuaca" data={this.state.cuaca} />}
            </Col>
            <Col>
              {this.state.loadingWidget ? <Spinner className="widget-spinner" animation="grow" variant="success" /> : <Widget tipe="suhu" data={this.state.suhu} />}
            </Col>
            <Col className="widget-right">
              {this.state.loadingWidget ? <Spinner className="widget-spinner" animation="grow" variant="success" /> : <Widget tipe="kelembapan" data={this.state.kelembapan} />}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Beranda;
