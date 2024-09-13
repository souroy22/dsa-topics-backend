import { NextFunction, Request, Response } from "express";

const requiredFieldsList = {
  SIGNUP: ["firstName", "email", "password", "lastName", "phone"],
  SIGN_IN: ["email", "password"],
  CREATE_TOPIC: ["title"],
  CREATE_QUESTION: ["title", "level", "description", "topicSlug"],
};

type REQUIRED_FIELD_NAME_TYPE = keyof typeof requiredFieldsList;

const checkMissingFields = (API_NAME: REQUIRED_FIELD_NAME_TYPE) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!requiredFieldsList[API_NAME]) {
      return res.status(500).json({
        error: `Invalid API_NAME: ${API_NAME}`,
      });
    }

    const requiredFields: string[] = requiredFieldsList[API_NAME];
    const missingFields: string[] = [];

    requiredFields.forEach((field) => {
      if (
        !req.body[field] ||
        (isNaN(Number(req.body[field])) && req.body[field].trim() === "")
      ) {
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

export default checkMissingFields;
