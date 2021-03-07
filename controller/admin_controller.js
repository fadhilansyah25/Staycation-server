const Category = require("../models/Category");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard.ejs", {
      title: "Staycation Dashboard",
    });
  },

  // Category controller
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category.ejs", {
        category,
        alert,
        title: "Staycation | Category",
      });
    } catch (error) {}
    res.redirect("/admin/category");
    console.log(error);
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Succesful Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Succesful Edit Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMessage", "Succesful Delete Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  viewBank: (req, res) => {
    res.render("admin/bank/view_bank.ejs", { title: "Staycation | Bank" });
  },
  viewitem: (req, res) => {
    res.render("admin/item/view_item.ejs", { title: "Staycation | Item" });
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking.ejs", {
      title: "Staycation | Booking",
    });
  },
};
