const Category = require("../models/Category");
const Bank = require("../models/Bank");
const fs = require('fs-extra');
const path = require('path')

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
    } catch (error) {
      res.redirect("/admin/category");
      console.log(error);
    }
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

  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/view_bank.ejs", {
        bank,
        alert,
        title: "Staycation | Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { BankName, AccountNumber, AccountName } = req.body;
      await Bank.create({
        namebank: BankName,
        accountNumber: AccountNumber,
        name: AccountName,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Succesful Add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, BankName, AccountNumber, AccountName } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        Object.assign(bank, {
          namebank: BankName,
          accountNumber: AccountNumber,
          name: AccountName,
        });
        await bank.save();
        req.flash("alertMessage", "Succesful Edit Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        Object.assign(bank, {
          namebank: BankName,
          accountNumber: AccountNumber,
          name: AccountName,
          imageUrl: `images/${req.file.filename}`
        });
        await bank.save();
        req.flash("alertMessage", "Succesful Edit Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      console.log(req.body)
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try { 
      const { id } = req.params;
      const bank = await Bank.findOne({_id: id});
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Succesful Delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank")
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
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
