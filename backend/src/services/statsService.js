const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const statsApi = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": process.env.API_FOOTBALL_KEY
  }
});

const mapaLigas = {
  PD: 140,
  PL: 39,
  SA: 135,
  BL1: 78,
  FL1: 61
};

const calcularTemporadaActual = () => {
  const año = new Date().getFullYear();
  const mes = new Date().getMonth() + 1;
  return mes < 7 ? año - 1 : año;
};

const limpiarNombre = (nombre) =>
  nombre.replace(/\./g, "").replace(/-/g, " ").trim();

const buscarJugador = async (params) => {
  const response = await statsApi.get("/players", { params });
  return response.data;
};

const getJugadorStats = async (nombreJugador, codigoLiga) => {
  const leagueId = mapaLigas[codigoLiga];
  const temporadaActual = calcularTemporadaActual();
  const temporadaAnterior = temporadaActual - 1;

  const nombreLimpio = limpiarNombre(nombreJugador);
  const partes = nombreLimpio.split(" ");
  const apellido = partes[partes.length - 1];

  const intentos = [
    { search: nombreLimpio, league: leagueId, season: temporadaActual },
    { search: apellido, league: leagueId, season: temporadaActual },
    { search: nombreLimpio, league: leagueId, season: temporadaAnterior },
    { search: apellido, league: leagueId, season: temporadaAnterior },

    // fallback sin liga
    { search: nombreLimpio, season: temporadaActual },
    { search: apellido, season: temporadaActual },
    { search: nombreLimpio, season: temporadaAnterior },
    { search: apellido, season: temporadaAnterior }
  ];

  for (const params of intentos) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    console.log("Buscando stats con:", params);

    const data = await buscarJugador(params);

    console.log("Resultados:", data.results);

    if (data.response && data.response.length > 0) {
      return {
        ...data,
        temporadaUsada: params.season
      };
    }
  }

  return {
    response: [],
    results: 0,
    temporadaUsada: temporadaActual
  };
};

module.exports = { getJugadorStats };