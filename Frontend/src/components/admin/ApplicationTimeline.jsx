import React from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  CalendarDays,
  Award,
  Send,
  PartyPopper,
  XCircle,
  Clock,
} from 'lucide-react';

const STAGES = [
  { id: 'applied', label: 'Application Submitted', icon: FileText },
  { id: 'screening', label: 'Profile Screening', icon: Search },
  { id: 'shortlisted', label: 'Candidate Shortlisted', icon: CheckCircle2 },
  { id: 'interview', label: 'Interview Scheduled', icon: CalendarDays },
  { id: 'evaluation', label: 'Interview Evaluated', icon: Award },
  { id: 'offer', label: 'Offer Letter Sent', icon: Send },
  { id: 'hired', label: 'Offer Accepted / Hired', icon: PartyPopper },
];

const getStageIndex = (status) => {
  switch (status) {
    case 'Applied':
      return 0;
    case 'Under Review':
      return 1;
    case 'Shortlisted':
      return 2;
    case 'Interview Scheduled':
    case 'Interview Accepted':
    case 'Interview Rejected':
      return 3;
    case 'Interview Completed':
    case 'Selected':
      return 4;
    case 'Offer Sent':
      return 5;
    case 'Offer Accepted':
      return 6;
    case 'Offer Rejected':
    case 'Rejected':
      return 4;
    default:
      return 0;
  }
};

const ApplicationTimeline = ({ application }) => {
  if (!application) return null;

  const currentStatus = application.status || 'Applied';
  const isRejected =
    currentStatus === 'Rejected' ||
    currentStatus === 'Offer Rejected' ||
    currentStatus === 'Interview Rejected';
  const isHired = currentStatus === 'Offer Accepted';
  const currentStageIndex = getStageIndex(currentStatus);

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-foreground">
            Pipeline Progress Tracker
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Recruitment lifecycle milestones and real-time status
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isHired ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              <PartyPopper className="w-3.5 h-3.5" /> Candidate Hired 🎉
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <XCircle className="w-3.5 h-3.5" /> Pipeline Closed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Clock className="w-3.5 h-3.5" /> Stage {currentStageIndex + 1} of {STAGES.length}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && isHired);
            const isCurrent = idx === currentStageIndex && !isHired;

            let badgeBg = 'bg-muted text-muted-foreground border-border';
            let textColor = 'text-muted-foreground';

            if (isCompleted) {
              badgeBg = 'bg-primary/15 text-primary border-primary/30 font-semibold shadow-xs';
              textColor = 'text-foreground font-medium';
            } else if (isCurrent) {
              if (isRejected) {
                badgeBg = 'bg-destructive text-destructive-foreground border-destructive shadow-xs';
                textColor = 'text-destructive font-semibold';
              } else {
                badgeBg = 'bg-primary text-primary-foreground border-primary shadow-xs ring-4 ring-primary/20';
                textColor = 'text-primary font-semibold';
              }
            }

            return (
              <div key={stage.id} className="flex md:flex-col items-center gap-3 md:text-center group">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${badgeBg}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div className="flex-1 md:w-full">
                  <p className={`text-xs ${textColor} leading-tight`}>{stage.label}</p>
                  {idx === 0 && application.createdAt && (
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  {idx === 3 && application.interview?.interviewDate && (
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {new Date(application.interview.interviewDate).toLocaleDateString()}
                    </p>
                  )}
                  {idx === 5 && application.offer?.createdAt && (
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {new Date(application.offer.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;
