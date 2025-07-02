import pool from "../../db.js";
export const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user by auth middleware
    try {
        // Fetch user profile from the database
        const userProfile = await pool.query(
            "SELECT id, name, email, avatar_url, created_at FROM users WHERE id=$1",
            [userId]
        );

        if (userProfile.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(userProfile.rows[0]);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Server error" });
    }
}