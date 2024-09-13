"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requiredFieldsList = {
    SIGNUP: ["firstName", "email", "password", "lastName", "phone"],
    SIGN_IN: ["email", "password"],
    CREATE_TOPIC: ["title"],
    CREATE_QUESTION: ["title", "level", "description", "topicSlug"],
};
const checkMissingFields = (API_NAME) => {
    return (req, res, next) => {
        if (!requiredFieldsList[API_NAME]) {
            return res.status(500).json({
                error: `Invalid API_NAME: ${API_NAME}`,
            });
        }
        const requiredFields = requiredFieldsList[API_NAME];
        const missingFields = [];
        requiredFields.forEach((field) => {
            if (!req.body[field] ||
                (isNaN(Number(req.body[field])) && req.body[field].trim() === "")) {
                missingFields.push(field);
            }
        });
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Missing or blank fields. Please fill the required fields.",
                missingFields,
            });
        }
        next();
    };
};
exports.default = checkMissingFields;
//# sourceMappingURL=checkMissingFields.js.map