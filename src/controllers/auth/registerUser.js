import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db.js"; // Assuming you have a db.js file that exports your database connection
export const registerUser = async (req, res) => {
    const { name, email, password, avatar_url } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Missing fields",
            });
        }
        // Here $1 is the placeholder for the first element in the array -> this is known as parametrized query.
        const userExists = await pool.query(
            "SELECT 1 FROM users WHERE email = $1",
            [email]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({
                error: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password, avatar_url)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, avatar_url, created_at`,
            [name, email, hashedPassword, avatar_url || null]
        );

        const token = jwt.sign(
            { id: result.rows[0].id, email: result.rows[0].email },
            process.env.JWT_SECRET
        );
        // Set the token in cookies
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "Strict", // Helps prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
                avatar_url: result.rows[0].avatar_url,
                created_at: result.rows[0].created_at,
            },
        });
    } catch (error) {
        console.error("Error while registering the user", error);
        res.status(500).json({ error: "Server error" });
    }
};