export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error while logging out the user", error);
        return res.status(500).json({ error: "Server error" });
    }
};
