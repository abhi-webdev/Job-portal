import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResumeCard = ({ resume, onDelete, onViewJobs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{resume.fileName}</CardTitle>

        <p className="text-xs text-muted-foreground">
          Uploaded{' '}
          {resume.createdAt
            ? new Date(resume.createdAt).toLocaleDateString()
            : ''}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-5">
          {resume.keywords?.map((keyword) => (
            <span
              key={keyword}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => onViewJobs(resume._id)}>
            Find Jobs
          </Button>

          <Button variant="destructive" onClick={() => onDelete(resume._id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeCard;
