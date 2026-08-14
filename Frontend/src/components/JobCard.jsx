import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

import MatchScore from './MatchScore';

const JobCard = ({ result, showMatch = true, resumeId, onApply }) => {
  const job = result?.job || result;

  const matchedSkills = result?.matchedSkills || [];

  const score = result?.score || 0;

  const navigate = useNavigate();
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>

            <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
          </div>

          {showMatch && <Badge>{score}% Match</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        {showMatch && (
          <div className="mb-5">
            <MatchScore score={score} />
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-6">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {job.skills?.map((skill) => {
            const isMatched = matchedSkills.some(
              (matchedSkill) =>
                matchedSkill.toLowerCase() === skill.toLowerCase(),
            );

            return (
              <Badge
                key={skill}
                variant={showMatch && isMatched ? 'default' : 'secondary'}
              >
                {skill}
              </Badge>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>📍 {job.location}</span>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>👥</span>
              <span>{result.applicationCount || 0} Applications</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Experience: {job.experience}
            </span>

            <Button
              onClick={() =>
                navigate(`/apply/${job._id}`, {
                  state: {
                    resumeId,
                  },
                })
              }
            >
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
