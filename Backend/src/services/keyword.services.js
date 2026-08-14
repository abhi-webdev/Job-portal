
const skills = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "express",
    "mongodb",
    "mysql",
    "postgresql",
    "java",
    "python",
    "c++",
    "html",
    "css",
    "tailwind",
    "docker",
    "git",
    "aws",
    "redux"
]


const extrectKeywords = (text) => {
    const lowerText = text.toLowerCase()

    const foundKeywords = []

    for(const skill of skills) {
        if (lowerText.includes(skill.toLowerCase())) {
            foundKeywords.push(skill)
        }
    }

    return foundKeywords

}

export default extrectKeywords