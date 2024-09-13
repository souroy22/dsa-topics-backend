"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkMissingFields = {
    signup: (req, res, next) => {
        const requiredFields = [
            "firstName",
            "email",
            "password",
            "lastName",
            "phone",
        ];
        const missingFields = [];
        // Check if any required field is missing or blank
        requiredFields.forEach((field) => {
            if (!req.body[field] ||
                (isNaN(Number(req.body[field])) && req.body[field].trim() === "")) {
                missingFields.push(field);
            }
        });
        // If any field is missing or blank, send an error response
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing or blank fields: ${missingFields.join(", ")}`,
            });
        }
        // No missing or blank fields, proceed to the next middleware
        next();
    },
    signin: (req, res, next) => {
        const requiredFields = ["email", "password"];
        const missingFields = [];
        // Check if any required field is missing or blank
        requiredFields.forEach((field) => {
            if (!req.body[field] || req.body[field].trim() === "") {
                missingFields.push(field);
            }
        });
        // If any field is missing or blank, send an error response
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Plese fill all required fields",
                missingFields,
            });
        }
        // No missing or blank fields, proceed to the next middleware
        next();
    },
};
exports.default = checkMissingFields;
//# sourceMappingURL=checkMissingFields.js.map