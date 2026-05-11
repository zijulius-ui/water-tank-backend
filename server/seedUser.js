import bcrypt from "bcrypt";
import User from "./models/User.js";

const password = await bcrypt.hash("123456", 10);

await User.create({
  email: "test@gmail.com",
  password: password,
  tankId: "A1"
});

console.log("User created");