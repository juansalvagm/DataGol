import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";

function PlayerStatsChart({ estadisticas }) {
  const data = [
    {
      stat: "Goles",
      valor: estadisticas.goals?.total || 0
    },
    {
      stat: "Asist.",
      valor: estadisticas.goals?.assists || 0
    },
    {
      stat: "Partidos",
      valor: estadisticas.games?.appearences || 0
    },
    {
      stat: "Min.",
      valor: Math.round((estadisticas.games?.minutes || 0) / 100)
    },
    {
      stat: "Amar.",
      valor: estadisticas.cards?.yellow || 0
    }
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "220px",
        marginTop: "14px"
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
        >
          <PolarGrid />

          <PolarAngleAxis
            dataKey="stat"
            tick={{
              fontSize: 10,
              fill: "rgba(255,255,255,0.72)",
              fontWeight: 700
            }}
          />

          <Radar
            dataKey="valor"
            stroke="#19e35f"
            fill="#19e35f"
            fillOpacity={0.55}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlayerStatsChart;