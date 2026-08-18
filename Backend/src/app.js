import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Serve uploads folder statically
const uploadsDir = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
    res.json({
        message: "Job Search API is running"
    });
});

// routes

import resumeRoutes from "./routes/resume.route.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import router from "./routes/auth.routes.js"
import adminRouter from "./routes/admin.routes.js"
import candidateRouter from "./routes/candidate.routes.js"


app.use("/api/auth", router)
app.use("/api/admin", adminRouter)
app.use("/api/resumes", resumeRoutes)

app.use("/api/jobs", jobRoutes);
app.use(
    "/api/applications",
    applicationRoutes
);

app.use("/api/candidate", candidateRouter)


export default app
