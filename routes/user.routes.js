const { Router } = require("express");
const { registerUser, loginUser, logoutUser, setMonthlyBudget } = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/set-budget').post(verifyJWT,setMonthlyBudget)

module.exports = router;
