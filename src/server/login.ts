import {generateID} from "@server/generatorID";
import bcrypt from "bcrypt";

// logs a new user
export const createLogin = async () => {
    const user = "admin";
    console.log("user: " + user);
    const password = generateID(10, "all");
    console.log("password: " + password);
    const salt = await bcrypt.genSalt(10);
    console.log("salt: " + salt);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log("hash: " + hashPassword);
}