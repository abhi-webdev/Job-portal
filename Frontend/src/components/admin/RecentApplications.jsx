import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { ArrowRight, User } from 'lucide-react';

const RecentApplications = ({ applications = [] }) => {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        No recent applications found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {applications.map((application) => (
        <div
          key={application._id}
          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 px-2 rounded-lg transition-colors cursor-pointer"
          onClick={() => navigate(`/admin/applications/${application._id}`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {application.fullName ? application.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-foreground">{application.fullName}</p>
                <span className="text-xs text-muted-foreground hidden md:inline">· {application.email}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Applied for <span className="font-medium text-foreground">{application.job?.title || 'Job Opening'}</span> {application.job?.company ? `at ${application.job.company}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <StatusBadge status={application.status} size="sm" />
            <span className="text-[11px] text-muted-foreground">
              {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
            </span>
            <button className="p-1 rounded-md text-muted-foreground hover:text-foreground">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentApplications;
