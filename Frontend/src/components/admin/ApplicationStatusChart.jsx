import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ORANGE_SHADES = [
  '#F97316',
  '#EA580C',
  '#FB923C',
  '#C2410C',
  '#FDBA74',
  '#71717A',
  '#A1A1AA',
  '#52525B',
];

const ApplicationStatusChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item._id || 'Unknown',
    value: item.count,
  }));

  return (
    <div className="h-[320px] w-full">
      {chartData.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
          No application data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={52}
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={ORANGE_SHADES[index % ORANGE_SHADES.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            />

            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationStatusChart;
