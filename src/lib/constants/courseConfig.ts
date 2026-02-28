/**
 * COURSE LEVEL CONFIGURATION
 * ----------------------------
 * Defines level-wise authority & verification
 */

export const COURSE_LEVELS = [
    {
        level: "Foundation Courses",
        authority: "Drishti Computer Education",
        verification: "Drishti Computer Education",
    },
    {
        level: "Accounting & Business Courses",
        authority:
            "Drishti Computer Education | Gramin Skill Development Mission",
        verification: "Drishti Computer Education | GSDM + NSDC",
    },
    {
        level: "Diploma Courses",
        authority: "Gramin Skill Development Mission",
        verification: "GSDM + NSDC + DigiLocker",
    },
    {
        level: "IT & Technical Courses",
        authority:
            "Gramin Skill Development Mission | Drishti Computer Education",
        verification:
            "NSDC + GSDM | Drishti Computer Education",
    },
    {
        level: "Cloud Computing",
        authority: "Gramin Skill Development Mission",
        verification: "GSDM + NSDC",
    },
    {
        level: "Web Development",
        authority:
            "Gramin Skill Development Mission | Drishti Computer Education",
        verification:
            "GSDM + NSDC | Drishti Computer Education",
    },
    {
        level: "App Development",
        authority:
            "Gramin Skill Development Mission | Drishti Computer Education",
        verification:
            "GSDM + NSDC | Drishti Computer Education",
    },
    {
        level: "Programming Languages",
        authority:
            "Gramin Skill Development Mission | Drishti Computer Education",
        verification:
            "GSDM + NSDC | Drishti Computer Education",
    },
];

/**
 * Designed For Mapping Logic
 * ----------------------------
 * Matches keywords from course name
 */

export const COURSE_DESIGNED_FOR_MAP = [
    {
        match: ["basic computer"],
        designedFor: [
            "Absolute Beginners",
            "First-time Computer Learners",
            "Students seeking basic computer literacy",
        ],
    },
    {
        match: ["ms office", "office"],
        designedFor: [
            "Office Job Aspirants",
            "College Students",
            "Data Entry Operators",
        ],
    },
    {
        match: ["tally", "busy", "gst"],
        designedFor: [
            "Accounting Students",
            "Working Professionals",
            "Office Staff",
        ],
    },
    {
        match: ["dca", "pgdca", "diploma"],
        designedFor: [
            "Graduate Students",
            "Diploma Aspirants",
        ],
    },
    {
        match: ["web", "app", "frontend", "backend"],
        designedFor: [
            "IT Aspirants",
            "Graduate Students",
        ],
    },
    {
        match: ["python", "java", "c++"],
        designedFor: [
            "Programming Learners",
            "IT Aspirants",
        ],
    },
];