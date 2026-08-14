import express from "express"
import cors from "cors"
const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())


app.get("/", (req, res) => {
    res.json({
        message: "Job Search API is running"
    });
});

// routes

import resumeRoutes from "./routes/resume.route.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

app.use("/api/resumes", resumeRoutes)

app.use("/api/jobs", jobRoutes);
app.use(
    "/api/applications",
    applicationRoutes
);

export default app
