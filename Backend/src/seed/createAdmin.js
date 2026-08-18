import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

const createAdmin = async () => {

    const password =
        await bcrypt.hash(
            "Admin@123",
            10
        );

    const admin =
        await User.create({
            name: "Admin",
            email: "admin@jobportal.com",
            password,
            role: "admin"

        });

    console.log(
        "Admin created:",
        admin.email
    );
};

createAdmin();