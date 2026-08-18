import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ApplicationsByJobChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    title:
      item.title?.length > 18
        ? `${item.title.substring(0, 18)}...`
        : item.title,
    applications: item.count,
  }));

  return (
    <div className="h-[350px] w-full">
      {chartData.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
          No application data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />

            <XAxis
              dataKey="title"
              angle={-30}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            />

            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />

            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            />

            <Bar dataKey="applications" fill="#F97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationsByJobChart;
