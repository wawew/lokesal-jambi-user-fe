import createStore from 'unistore';
import axios from 'axios';

const initialState = {
  logoKota: "https://jambikota.go.id/new/wp-content/uploads/Logojmb_edited2.jpg",
  namaKota: "Jambi",
  tajukKota: "Tanah Pilih Pesako Betuah",
  mapboxUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
  mapboxKey: "pk.eyJ1Ijoic3VtYXJub3dpbGx5OTQiLCJhIjoiY2s2NHo0YzlzMDMwMjNscXdzYmo3dDV4cyJ9.bOcW5ZPZob_quslf4RP0sw",
  lokasiUser: ""
}

export const store = createStore(initialState);

export const actions = store => ({
  getLokasi: (state, lonlat) => {
    const request = {
      method: 'get',
      url: `${state.mapboxUrl}${lonlat[0]},${lonlat[1]}.json?access_token=${state.mapboxKey}`,
      headers: {'Content-Type': 'application/json'}
    }
    axios(request)
      .then(response => {
        store.setState({lokasiUser: response.data.features[0].place_name})
      })
  }
})
