import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store/store';
import Kembali from '../components/kembali';
import NamaLokasi from '../components/namaLokasi';

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
        <div onClick={() => console.log("WILDAN")}>
          <NamaLokasi lokasi={this.props.lokasiUser} />
        </div>
      </React.Fragment>
    )
  }
}

export default connect("lokasiUser", actions)(Keluhkan);
