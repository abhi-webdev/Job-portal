import env from "dotenv"
env.config();

import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 3000;
connectDb()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});