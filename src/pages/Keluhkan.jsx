import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions } from '../store/store';
import Kembali from '../components/kembali';
import NamaLokasi from '../components/namaLokasi';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import '../styles/namaLokasi.css';

class Keluhkan extends React.Component {
  componentDidMount = () => {
    // Get lokasi user
    navigator.geolocation.getCurrentPosition(
      position => this.props.getLokasi([
        position.coords.longitude,
        position.coords.latitude
      ])
    )
  }

  render() {
    return (
      <React.Fragment>
        <Kembali />
        {this.props.loadingLokasiUser ?
          <Container fluid className="namalokasi">
            <Row>
              <Col className="namalokasi-loading">
                <Spinner animation="grow" variant="success" />
              </Col>
            </Row>
          </Container> :
          <div onClick={() => this.props.history.push("/carilokasi")}>
            <NamaLokasi lokasi={this.props.lokasiUser} />
          </div>
        }
      </React.Fragment>
    )
  }
}

export default connect("lokasiUser, loadingLokasiUser", actions)(withRouter(Keluhkan));
