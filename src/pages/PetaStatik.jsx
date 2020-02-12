import React from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "unistore/react";
import { withRouter } from "react-router-dom";
import { store } from "../store/store";
import "../styles/petaLokasi.css";
import { FaChevronLeft } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

mapboxgl.accessToken = store.getState().mapboxKey;

class PetaStatik extends React.Component {
  state = {
    lng: this.props.lng,
    lat: this.props.lat,
    zoom: 16
  };

  componentDidMount = () => {
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

    let geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [this.state.lng, this.state.lat]
          }
        }
      ]
    };

    geojson.features.forEach(function(marker) {
      let el = document.createElement("div");
      el.className = "marker";
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    });
  };

  render() {
    return (
      <div>
        <div className="sidebarStyle">
          <Container fluid className="kembali">
            <Row>
              <Col className="kembali-col">
                <div
                  className="kembali-div"
                  onClick={() => this.props.history.goBack()}
                >
                  <span className="kembali-icon">
                    <FaChevronLeft />
                  </span>
                  <span className="kembali-nama"> Kembali</span>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

export default connect("lng, lat")(withRouter(PetaStatik));
