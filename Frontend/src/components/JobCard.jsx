import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

const JobCard = ({ result, showMatch = true, resumeId, onApply }) => {
  const job = result?.job || result;
  const matchedSkills = result?.matchedSkills || [];
  const score = result?.score || 0;
  const navigate = useNavigate();

  const isExpired = job.timeline?.applicationDeadline
    ? new Date(job.timeline.applicationDeadline) < new Date(new Date().setHours(0, 0, 0, 0))
    : false;

  return (
    <Card className="h-full flex flex-col justify-between bg-card border-border hover:border-primary/40 hover:shadow-md transition-all duration-200 group rounded-xl overflow-hidden">
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full gap-5">
        <div className="space-y-3">
          {/* Header & Badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                {job.jobType || 'Full-time'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                {job.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                {job.company}
              </p>
            </div>

            {showMatch && (
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/30 shadow-xs">
                  <Sparkles className="w-3 h-3" /> {score}% match
                </span>
              </div>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Skills Tags */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.skills.slice(0, 5).map((skill, index) => {
                const isMatched = matchedSkills.some(
                  (ms) => ms.toLowerCase() === skill.toLowerCase(),
                );

                return (
                  <span
                    key={index}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                      isMatched
                        ? 'bg-primary/15 text-primary border-primary/30 font-semibold'
                        : 'bg-muted/70 text-muted-foreground border-border'
                    }`}
                  >
                    {skill}
                  </span>
                );
              })}
              {job.skills.length > 5 && (
                <span className="text-[10px] font-mono text-muted-foreground self-center">
                  +{job.skills.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary/70" />
              {job.location || 'Remote'}
            </span>
            {job.experience && (
              <span className="hidden sm:flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-primary/70" />
                {job.experience}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="text-xs h-8 px-3"
            >
              Details
            </Button>

            <Button
              size="sm"
              disabled={isExpired}
              onClick={() =>
                navigate(`/apply/${job._id}`, {
                  state: {
                    resumeId,
                  },
                })
              }
              className="text-xs h-8 px-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold gap-1"
            >
              Apply <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
