const jwt = require("jsonwebtoken");
// const SECRET = 'onBoardSpecficAucenticationToken'

module.exports = function (req, res, next) {
    const token = req.cookies.onBoardToken;

    if (!token) {
        res.status(422).send('No token provided');
    } else {
        jwt.verify(token, process.env.ON_BOARD_SRCRET, function (err, decoded) {
            if (err) {
                res.status(401).send(token + ' failed');
            } else {
                req.username = decoded.username;
                req.email = decoded.email;
                next();
            }
        })
    }
}