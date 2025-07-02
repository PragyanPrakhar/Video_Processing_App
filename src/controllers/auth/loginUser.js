import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db.js"; 
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );
        if (userExists.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = userExists.rows[0];
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET,{
            expiresIn: "7d",
        });
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            message: "Logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                created_at: user.created_at,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
