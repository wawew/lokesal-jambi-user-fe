import createStore from 'unistore';

const initialState = {
  logoKota: "https://jambikota.go.id/new/wp-content/uploads/Logojmb_edited2.jpg",
  namaKota: "Jambi",
  tajukKota: "Tanah Pilih Pesako Betuah"
}

export const store = createStore(initialState);
