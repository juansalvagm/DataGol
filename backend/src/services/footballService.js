const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const footballApi = axios.create({
  baseURL: "https://api.football-data.org/v4",
  headers: {
    "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN
  }
});

const cache = {
  ligas: null,
  ligasTimestamp: 0,
  equipos: {},
  jugadores: {},
  partidos: {},
  clasificacion: {}
};

const CACHE_TIME = 10 * 60 * 1000;

const getLigas = async () => {
  const ahora = Date.now();

  if (cache.ligas && ahora - cache.ligasTimestamp < CACHE_TIME) {
    return cache.ligas;
  }

  const response = await footballApi.get("/competitions");

  cache.ligas = response.data;
  cache.ligasTimestamp = ahora;

  return response.data;
};

const getEquipos = async (codigoLiga) => {
  const ahora = Date.now();
  const cacheEquipos = cache.equipos[codigoLiga];

  if (cacheEquipos && ahora - cacheEquipos.timestamp < CACHE_TIME) {
    return cacheEquipos.data;
  }

  const response = await footballApi.get(`/competitions/${codigoLiga}/teams`);

  cache.equipos[codigoLiga] = {
    data: response.data,
    timestamp: ahora
  };

  return response.data;
};

const getJugadoresPorEquipo = async (idEquipo) => {
  const ahora = Date.now();
  const cacheJugadores = cache.jugadores[idEquipo];

  if (cacheJugadores && ahora - cacheJugadores.timestamp < CACHE_TIME) {
    return cacheJugadores.data;
  }

  const response = await footballApi.get(`/teams/${idEquipo}`);

  cache.jugadores[idEquipo] = {
    data: response.data,
    timestamp: ahora
  };

  return response.data;
};

const getPartidos = async (codigoLiga) => {
  const ahora = Date.now();
  const cachePartidos = cache.partidos[codigoLiga];

  if (cachePartidos && ahora - cachePartidos.timestamp < CACHE_TIME) {
    return cachePartidos.data;
  }

  const response = await footballApi.get(`/competitions/${codigoLiga}/matches`);

  cache.partidos[codigoLiga] = {
    data: response.data,
    timestamp: ahora
  };

  return response.data;
};

const getClasificacion = async (codigoLiga) => {
  const ahora = Date.now();
  const cacheClasificacion = cache.clasificacion[codigoLiga];

  if (cacheClasificacion && ahora - cacheClasificacion.timestamp < CACHE_TIME) {
    return cacheClasificacion.data;
  }

  const response = await footballApi.get(`/competitions/${codigoLiga}/standings`);

  cache.clasificacion[codigoLiga] = {
    data: response.data,
    timestamp: ahora
  };

  return response.data;
};

module.exports = {
  getLigas,
  getEquipos,
  getJugadoresPorEquipo,
  getPartidos,
  getClasificacion
};