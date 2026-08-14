import Job from '../models/job.model.js';
import Application from '../models/application.model.js';

const getMatchingJob = async (keywords) => {
  const jobs = await Job.find();

  const results = await Promise.all(
    jobs.map(async (job) => {
      const matchedskills = job.skills.filter((skill) =>
        keywords.includes(skill.toLowerCase()),
      );

      const score =
        keywords.length === 0
          ? 0
          : Math.round((matchedskills.length / keywords.length) * 100);

      const applicationCount = await Application.countDocuments({
        job: job._id,
      });

      return {
        job,
        matchedskills,
        score,
        applicationCount,
      };
    }),
  );

  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
};

export default getMatchingJob;
