import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const MatchScore = ({ score }) => {

    const getLabel = () => {

        if (score >= 80) {
            return "Excellent Match";
        }

        if (score >= 60) {
            return "Good Match";
        }

        if (score >= 40) {
            return "Fair Match";
        }

        return "Low Match";
    };


    return (
        <div className="space-y-2">

            <div className="flex items-center justify-between">

                <span className="text-sm text-muted-foreground">
                    Resume Match
                </span>

                <Badge variant="secondary">
                    {score}%
                </Badge>

            </div>

            <Progress value={score} />

            <p className="text-xs text-muted-foreground">
                {getLabel()}
            </p>

        </div>
    );
};

export default MatchScore;