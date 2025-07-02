import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id || !decoded.email) {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (process.env.NODE_ENV !== "production") {
            console.log("✅ Authenticated user:", decoded);
        }

        // You can also attach user info to the request object if needed
        // For example, req.user = { id: decoded.id, email: decoded.email };
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};
