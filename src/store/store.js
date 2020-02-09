import createStore from "unistore";
import axios from "axios";
import swal from "sweetalert";

const initialState = {
  urlBackend: "https://api.lokesal.online",
  logoKota:
    "https://jambikota.go.id/new/wp-content/uploads/Logojmb_edited2.jpg",
  namaKota: "Jambi",
  tajukKota: "Tanah Pilih Pesako Betuah",
  mapboxUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
  mapboxKey:
    "pk.eyJ1Ijoic3VtYXJub3dpbGx5OTQiLCJhIjoiY2s2NHo0YzlzMDMwMjNscXdzYmo3dDV4cyJ9.bOcW5ZPZob_quslf4RP0sw",
  lokasiUser: "",
  loadingLokasiUser: false,
  lng: 0,
  lat: 0,
  isiKeluhan: "",
  anonim: false,
  foto: null,
  uriFoto: "",
  linkFoto: "",
  namaFoto: ""
};

export const store = createStore(initialState);

export const actions = store => ({
  getLokasi: (state, lonlat) => {
    store.setState({
      loadingLokasiUser: true,
      lng: lonlat[0],
      lat: lonlat[1]
    });
    const request = {
      method: "get",
      url: `${state.mapboxUrl}${lonlat[0]},${lonlat[1]}.json?access_token=${state.mapboxKey}`,
      headers: { "Content-Type": "application/json" }
    };
    axios(request).then(response => {
      if (response.data.features.length === 0) {
        store.setState({
          loadingLokasiUser: false
        });
        swal(
          "Pilih Lokasi Gagal!",
          "Lokasi yang anda cari tidak valid.",
          "error"
        );
      } else {
        store.setState({
          lokasiUser: response.data.features[0].place_name,
          loadingLokasiUser: false
        });
      }
    });
  }
});
