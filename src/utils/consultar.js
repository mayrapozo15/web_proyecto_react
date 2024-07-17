import axios from 'axios';

const baseUrl = 'http://localhost/ws_core/public/index.php/';
const ws_service = 'http://localhost/ws_core/public/index.php/';

async function consultar(url, tipo = 'GET', datos = null, rutaEnlace = 'ws') {
  if (rutaEnlace === 'ws') rutaEnlace = ws_service;
  if (rutaEnlace === '') rutaEnlace = baseUrl;
  try {
    const config = {
      method: tipo,
      url: `${rutaEnlace}${url}`,
    };
    if (tipo.toUpperCase() === 'POST' || tipo.toUpperCase() === 'PUT') {
      config.data = datos;
    } else {
      config.params = datos;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error en la consulta:', error);
    throw new Error('Error en la consulta, vuelva a intentar');
  }
}

export default consultar;
