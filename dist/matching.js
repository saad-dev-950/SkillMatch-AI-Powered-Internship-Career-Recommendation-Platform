"use strict";
/**
 * SkillMatch Deterministic Matching Engine
 *
 * Formula:
 * Match Score = (0.60 * SkillScore) + (0.20 * LocationScore) + (0.20 * CategoryScore)
 *
 * Output: Normalized 0 - 100 percentage.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFICIENCY_WEIGHTS = exports.WEIGHT_CATEGORY = exports.WEIGHT_LOCATION = exports.WEIGHT_SKILL = void 0;
exports.calculateMatchScore = calculateMatchScore;
// Weight Constants
exports.WEIGHT_SKILL = 0.60;
exports.WEIGHT_LOCATION = 0.20;
exports.WEIGHT_CATEGORY = 0.20;
exports.PROFICIENCY_WEIGHTS = {
    BEGINNER: 0.70,
    INTERMEDIATE: 0.85,
    ADVANCED: 0.95,
    EXPERT: 1.00,
};
/**
 * Calculates deterministic match result for a single student against an internship listing.
 */
function calculateMatchScore(student, job) {
    // 1. Calculate SkillScore (60% weight)
    const requiredSkills = job.requiredSkills || [];
    const studentSkillsMap = new Map();
    for (const s of student.skills) {
        studentSkillsMap.set(s.skillId, s);
    }
    const matchedSkills = [];
    const missingSkills = [];
    let totalProficiencySum = 0;
    if (requiredSkills.length === 0) {
        // If no required skills are defined, default skill score is 100
        totalProficiencySum = 1.0;
    }
    else {
        for (const reqSkill of requiredSkills) {
            const studentSkill = studentSkillsMap.get(reqSkill.skillId);
            if (studentSkill) {
                const pWeight = exports.PROFICIENCY_WEIGHTS[studentSkill.level.toUpperCase()] || 0.85;
                totalProficiencySum += pWeight;
                matchedSkills.push({
                    skillId: reqSkill.skillId,
                    name: reqSkill.name,
                    studentLevel: studentSkill.level,
                    proficiencyWeight: pWeight,
                });
            }
            else {
                missingSkills.push({
                    skillId: reqSkill.skillId,
                    name: reqSkill.name,
                });
            }
        }
    }
    const skillScore = requiredSkills.length === 0
        ? 100
        : Math.min(100, Math.max(0, (totalProficiencySum / requiredSkills.length) * 100));
    // 2. Calculate LocationScore (20% weight)
    let locationScore = 40;
    let locationMatchReason = "Incompatible location/work mode";
    const jobWorkMode = job.workMode.toUpperCase();
    const studentWorkMode = (student.preferredWorkMode || "").toUpperCase();
    if (jobWorkMode === "REMOTE") {
        locationScore = 100;
        locationMatchReason = "Job is 100% Remote (Fully Compatible)";
    }
    else if (studentWorkMode === jobWorkMode) {
        locationScore = 100;
        locationMatchReason = `Work mode match (${jobWorkMode})`;
    }
    else if (student.location &&
        job.location &&
        (student.location.toLowerCase().includes(job.location.toLowerCase()) ||
            job.location.toLowerCase().includes(student.location.toLowerCase()))) {
        locationScore = 100;
        locationMatchReason = `Location proximity match (${job.location})`;
    }
    else if (studentWorkMode === "REMOTE" && jobWorkMode === "HYBRID") {
        locationScore = 70;
        locationMatchReason = "Hybrid job with Remote preference (Partial Match)";
    }
    // 3. Calculate CategoryScore (20% weight)
    let categoryScore = 50;
    let categoryMatchReason = "Different job domain category";
    if (student.preferredCategory && student.preferredCategory === job.categoryId) {
        categoryScore = 100;
        categoryMatchReason = "Exact preferred category match";
    }
    else if (student.targetRole &&
        job.categoryName &&
        student.targetRole.toLowerCase().includes(job.categoryName.toLowerCase())) {
        categoryScore = 80;
        categoryMatchReason = `Target role aligns with ${job.categoryName}`;
    }
    // 4. Compute Weighted Total Score
    const rawScore = exports.WEIGHT_SKILL * skillScore +
        exports.WEIGHT_LOCATION * locationScore +
        exports.WEIGHT_CATEGORY * categoryScore;
    // Round score to nearest integer bounded between 0 and 100
    const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));
    return {
        internshipId: job.id,
        matchScore: finalScore,
        scoreBreakdown: {
            skillScore: Math.round(skillScore),
            locationScore: Math.round(locationScore),
            categoryScore: Math.round(categoryScore),
            rawScore: Math.round(rawScore * 100) / 100,
            finalScore,
        },
        matchedSkills,
        missingSkills,
        locationMatchReason,
        categoryMatchReason,
    };
}
