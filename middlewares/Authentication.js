import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Seller from '../models/seller.js';



dotenv.config();


// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.body.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);
    // Get token from body or Authorization header
   

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err); // Improved error logging
            return res.status(400).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // Attach user info to request
        next();
    });
};

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.body.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader); // Get token from body or Authorization header
  

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // Attach user info to request
        next();
    });
};

const authenticateSeller = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.body.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader); // Get token from body or Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err); // Improved error logging
            return res.status(400).json({ message: 'Invalid token.' });
        }

        const seller = await Seller.findById(decoded._id); // Assuming Seller is a User with a specific role
        if (!seller ) {
            return res.status(403).json({ message: 'Access denied. Not a seller.' });
        }

        req.user = decoded; // Attach user info to request
        next();
    });
};


// Middleware to authenticate admin


export { authenticateUser, authenticate , authenticateSeller};
