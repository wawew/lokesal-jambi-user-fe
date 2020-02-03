import React from 'react';
import { WiHumidity } from 'react-icons/wi';

const Widget = props => {
  if (props.tipe === "cuaca") {
    const src = `https://openweathermap.org/img/wn/${props.data}@2x.png`;
    return <img alt="cuaca" src={src} />;
  } else if (props.tipe === "suhu") {
    return <h6>{props.data | 0}<span>&#8451;</span></h6>;
  } else if (props.tipe === "kelembapan") {
    return <h6>{props.data}<WiHumidity /></h6>;
  }
}

export default Widget;
