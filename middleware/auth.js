const isLogin = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash("alertMessage", "You're Not Logged In");
        req.flash("alertStatus", "warning");
        res.redirect("/admin/signin");
    } else {
        next();
    }
}

module.exports = isLogin;