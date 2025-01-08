import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import styled from "styled-components";

const Container = styled.div`
  flex-direction: column;
  justify-content: center;
  height: 160px;
`;

const RankChartContainer = styled.div`
  max-width: 640px;
  width: 100%;
  position: fixed;
  left: 47%;
  transform: translateX(-50%);
`;

interface RankChartProps {
  lpHistories: {
    created_at: string;
    tier_info: {
      tier: string;
      division: number;
      lp: number;
    };
  }[];
}

const Tierlabel = {
  IRON: "I",
  BRONZE: "B",
  SILVER: "S",
  GOLD: "G",
  PLATINUM: "P",
  EMERALD: "E",
  DIAMOND: "D",
  MASTER: "M",
  GRANDMASTER: "GM",
  CHALLENGER: "CH",
} as const;

const TierOrder = {
  IRON: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  EMERALD: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 8,
  CHALLENGER: 9,
} as const;

export const RankChart = ({ lpHistories }: RankChartProps) => {
  const data = lpHistories.map((entry) => {
    const tierValue = TierOrder[entry.tier_info.tier as keyof typeof TierOrder];
    const divisionValue = 5 - entry.tier_info.division; // Divisionが低いほど価値が高い
    const score = tierValue * 1000 + divisionValue * 100 + entry.tier_info.lp; // スコアを計算

    return {
      date: new Date(entry.created_at).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      }),
      score,
      tier: entry.tier_info.tier,
      tierLabel: `${Tierlabel[entry.tier_info.tier as keyof typeof Tierlabel]}${
        entry.tier_info.division
      }`,
    };
  });

  const maxLp = Math.max(...data.map((d) => d.score));
  const minLp = Math.min(...data.map((d) => d.score));
  const yAxisMax = Math.ceil(maxLp / 100) * 100;
  const yAxisMin = Math.floor(minLp / 100) * 100;

  return (
    <Container>
      <RankChartContainer>
        <LineChart
          data={data}
          width={640}
          height={200}
          margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" interval={1} />
          <YAxis domain={[yAxisMin, yAxisMax]} tick={false} />
          <Tooltip formatter={(value) => [value, ""]} />
          <Legend formatter={() => ""} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            label={({ x, y, index }) =>
              index % 3 === 0 || index === data.length - 1 ? (
                <text
                  x={x}
                  y={y - 7}
                  dy={-10}
                  fill="#EDF3B7"
                  fontSize={14}
                  textAnchor="middle"
                >
                  <tspan x={x} dy="-1.2em">
                    {data[index].tierLabel}
                  </tspan>
                  <tspan x={x} dy="1.2em" fontSize={14}>
                    {lpHistories[index].tier_info.lp} LP
                  </tspan>
                </text>
              ) : null
            }
          />
        </LineChart>
      </RankChartContainer>
    </Container>
  );
};
