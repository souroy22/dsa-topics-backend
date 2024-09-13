"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkForValidEmail = (email) => {
    return !!String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.default = checkForValidEmail;
//# sourceMappingURL=checkValidEmail.js.map