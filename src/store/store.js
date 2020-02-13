import createStore from "unistore";
import axios from "axios";
import swal from "sweetalert";
import Credentials from "../credentials.json";

const initialState = {
  urlBackend: "https://api.lokesal.online",
  mapboxUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
  mapboxKey: Credentials.mapboxKey,
  newsApiUrl: "https://newsapi.org/v2/top-headlines?country=id&apiKey=",
  newsApiKey: Credentials.newsApiKey,
  weatherUrl: "https://api.openweathermap.org/data/2.5/weather",
  weatherKey: Credentials.weatherKey,
  namaKota: "Jambi",
  tajukKota: "Tanah Pilih Pesako Betuah",
  lng: 0,
  lat: 0,
  lokasiUser: "",
  loadingLokasiUser: false,
  isiKeluhan: "",
  anonim: false,
  foto: null,
  uriFoto: "",
  linkFoto: "",
  namaFoto: ""
};

export const store = createStore(initialState);

export const actions = store => ({
  /**
   * Mendapatkan nama lokasi berdasarkan longitude dan latitude
   *
   * @param {object} state Default state di unistore
   * @param {array} lonlat Longitude dan latitude suatu lokasi
   */
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
