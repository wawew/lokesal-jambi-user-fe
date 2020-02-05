import React from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "unistore/react";
import { withRouter } from "react-router-dom";
import { store } from "../store/store";
import "../styles/petaLokasi.css";
import Kembali from "../components/kembali";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { IoMdLocate } from "react-icons/io";

mapboxgl.accessToken = store.getState().mapboxKey;

class PetaLokasi extends React.Component {
  state = {
    lng: this.props.lng,
    lat: this.props.lat,
    zoom: 16
  };

  clickButton = () => {
    store.setState({ lng: this.state.lng, lat: this.state.lat });
    this.props.history.push("/keluhkan");
  };

  clickButtonKanan = () => {
    navigator.geolocation.getCurrentPosition(position =>
      this.setState(
        {
          lng: position.coords.longitude,
          lat: position.coords.latitude
        },
        () => this.componentDidMount()
      )
    );
  };

  componentDidMount = () => {
    if (localStorage.getItem("token") === null) {
      this.props.history.push("/masuk");
    }

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  };

  render() {
    return (
      <div>
        <div className="sidebarStyle">
          <Kembali path="/carilokasi" />
        </div>
        <div className="petalokasi-marker">
          <FaMapMarkerAlt />
        </div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
        <Button
          onClick={() => this.clickButton()}
          className="petalokasi-button"
          variant="success"
        >
          Pilih Lokasi
        </Button>
        <Button
          onClick={() => this.clickButtonKanan()}
          className="petalokasi-buttonkanan"
          variant="light"
        >
          <IoMdLocate />
        </Button>
      </div>
    );
  }
}

export default connect("lng, lat")(withRouter(PetaLokasi));
