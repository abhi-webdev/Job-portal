import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    company :{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default : []
    },
    location: {
        type: String
    },
    jobType: {
        type: String
    },
    experience: {
        type: String
    },
    applyUrl: {
        type: String
    }
}, {timestamps: true})

const job = mongoose.model("Job", jobSchema)

export default job