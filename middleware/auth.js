const isLogin = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash("alertMessage", "Your session has expired, you are now logged out automatically.");
        req.flash("alertStatus", "warning");
        res.redirect("/admin/signin");
    } else {
        next();
    }
}

module.exports = isLogin;