const whalesAccountModel = require("../models/account.model")
const jwt = require('jsonwebtoken')


exports.getRewards = async (req, res) => {
try {
    const headers = req.headers.authorization;
    if (!headers) {
    return res.json({
        status: false,
        message: "No token provided",
    });
    }

    const token = headers.split(" ")[1];
    jwt.verify(token, process.env.secret_key, async (err, result) => {
    if (err) {
        console.log(err);
        return res.json({
        status: false,
        message: "Token is expired or invalid",
        err: err.message,
        });
    }

    const email = result.email;
    const user = await whalesAccountModel.findOne({ email });

    if (!user) {
        return res.json({
        status: false,
        message: "Reward error",
        lastClaim: user.lastClaim || 0,
        
        });
    }

    const now = Date.now();

    // ✅ FIXED spelling (was lasTclaim)
    if (user.lastClaim && now - user.lastClaim < 24 * 60 * 60 * 1000) {
        const remaining = 24 * 60 * 60 * 1000 - (now - user.lastClaim);
        return res.json({
        status: false,
        message: "Claim not ready yet",
        remaining,
        });
    }

    // ✅ Reward user
    user.balance += 1000;
    user.lastClaim = now;
    await user.save();

    return res.json({
        status: true,
        message: "Claim successful, next claim in 24hrs",
        balance: user.balance,
        lastClaim: user.lastClaim,
    });
    });
} catch (err) {
    res.status(500).json({
    message: "Server error",
    status: false,
    err: err.message,
    });
}
};

