const StatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="text-3xl font-bold mt-2">{value}</p>

          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        </div>

        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
