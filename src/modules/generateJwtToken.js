const jwt = require('jsonwebtoken')
exports.generateToken = (name , contact) => {
    const payload = { name, contact }
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '100000m' })
    console.log("token created successfully ");
    return token;
}