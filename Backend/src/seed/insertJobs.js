import dotenv from "dotenv";

dotenv.config();

import Job from "../models/job.model.js";
import { jobs } from "./job.seed.js";
import connectDB from "../config/db.js";

const insertJobs = async () => {
    try {

        await connectDB();

        await Job.deleteMany({});

        const result = await Job.insertMany(jobs);

        console.log(`${result.length} jobs inserted successfully`);

        process.exit(0);

    } catch (error) {

        console.error("Error inserting jobs:", error);

        process.exit(1);
    }
};

insertJobs();