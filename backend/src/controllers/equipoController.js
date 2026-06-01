const Equipo =
  require(
    "../models/equipoModel"
  );

const obtenerEquipos =
  async (req, res) => {

  try {

    const { usuario_id } =
      req.query;

    const equipos =
      usuario_id
        ? await Equipo.obtenerEquiposPorUsuario(usuario_id)
        : await Equipo.obtenerEquipos();

    res.json(equipos);

  } catch (error) {

    res.status(500).json({
      error:
        error.message
    });
  }
};

const obtenerEquipoPorId =
  async (req, res) => {

  try {

    const equipo =
      await Equipo.obtenerEquipoPorId(
        req.params.id
      );

    res.json(equipo);

  } catch (error) {

    res.status(500).json({
      error:
        error.message
    });
  }
};

const crearEquipo =
  async (req, res) => {

  try {

    const {
      nombre,
      liga,
      pais,
      escudo_url,
      usuario_id
    } = req.body;

    const resultado =
      await Equipo.crearEquipo(
        nombre,
        liga,
        pais,
        escudo_url,
        usuario_id
      );

    res.json(resultado);

  } catch (error) {

    res.status(500).json({
      error:
        error.message
    });
  }
};

const actualizarEquipo =
  async (req, res) => {

  try {

    const {
      nombre,
      liga,
      pais,
      escudo_url
    } = req.body;

    const resultado =
      await Equipo.actualizarEquipo(
        req.params.id,
        nombre,
        liga,
        pais,
        escudo_url
      );

    res.json(resultado);

  } catch (error) {

    res.status(500).json({
      error:
        error.message
    });
  }
};

const eliminarEquipo =
  async (req, res) => {

  try {

    const resultado =
      await Equipo.eliminarEquipo(
        req.params.id
      );

    res.json(resultado);

  } catch (error) {

    res.status(500).json({
      error:
        error.message
    });
  }
};

module.exports = {
  obtenerEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo
};