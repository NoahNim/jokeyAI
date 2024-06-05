const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.')
        .isLength({ max: 100 })
    ,
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 30 })
        .withMessage('Please provide an unused username with at least 4 characters but less than 30 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .custom(value => {
            return User.findOne({ where: { username: value } }).then((user) => {
                if (user) {
                    return Promise.reject('Please provide an unused username with at least 4 characters but less than 30 characters.')
                }
            })
        }),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors,
];

const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a valid password."),
    handleValidationErrors,
];

router.post(
    '/sign-up',
    validateSignup,
    asyncHandler(async (req, res) => {
        let user;
        const { username, email, password } = req.body
        user = await User.signup({ username, email, password, });

        const token = await setTokenCookie(res, user);

        return res.json({
            user,
            token
        });
    }),
);

// Log in
router.post(
    '/login',
    validateLogin,
    asyncHandler(async (req, res, next) => {
        const { credential, password } = req.body

        const user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = [`The provided credentials were invalid.`];
            return next(err);
        }

        const token = await setTokenCookie(res, user);

        return res.json({
            user,
            token
        });
    }),
);

//Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    restoreUser,
    asyncHandler(async (req, res) => {
        const { user } = req;
        if (user) {

            const token = await setTokenCookie(res, user)

            return res.json({
                user: user.toSafeObject(),
                token: token,
            });
        } else return res.json({});
    })
);

module.exports = router;