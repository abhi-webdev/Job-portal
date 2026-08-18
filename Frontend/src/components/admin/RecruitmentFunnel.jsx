const RecruitmentFunnel = ({ statusStats = [] }) => {
  const statuses = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Interview Completed',
    'Selected',
    'Offer Sent',
    'Offer Accepted',
  ];

  const getCount = (status) => {
    const item = statusStats.find((item) => item._id === status);

    return item?.count || 0;
  };

  const max = Math.max(...statuses.map(getCount), 1);

  return (
    <div className="space-y-4">
      {statuses.map((status) => {
        const count = getCount(status);

        const percentage = (count / max) * 100;

        return (
          <div key={status}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{status}</span>

              <span className="text-sm text-muted-foreground">{count}</span>
            </div>

            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecruitmentFunnel;
