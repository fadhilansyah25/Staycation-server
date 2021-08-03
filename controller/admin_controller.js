const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");

const fs = require("fs-extra");
const path = require("path");
const { Console } = require("console");

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

  // Bank controller
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
          imageUrl: `images/${req.file.filename}`,
        });
        await bank.save();
        req.flash("alertMessage", "Succesful Edit Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      console.log(req.body);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Succesful Delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  // Item controller
  viewItem: async (req, res) => {
    try {
      const categories = await Category.find();
      const items = await Item.find()
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item.ejs", {
        categories,
        items,
        alert,
        action: "view",
        title: "Staycation | Item",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, description } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          price,
          description,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Succesful Add Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item.ejs", {
        item,
        alert,
        action: "show image",
        title: "Staycation | Show Image Item",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      const categories = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item.ejs", {
        categories,
        item,
        alert,
        action: "edit",
        title: "Staycation | Edit Item",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, description } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
          Object.assign(item, {
            title,
            price,
            city,
            description,
            categoryId,
          });
          await item.save();
          req.flash("alertMessage", "Succesful Update Item");
          req.flash("alertStatus", "success");
          res.redirect("/admin/item");
        }
      } else {
        Object.assign(item, {
          title,
          price,
          city,
          description,
          categoryId,
        });
        await item.save();
        req.flash("alertMessage", "Succesful Update Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      const category = await Category.findOne({ _id: item.categoryId });
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      category.itemId.pop({ _id: item._id });
      await category.save();
      req.flash("alertMessage", "Succesful Delete Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const features = await Feature.find({ itemId: itemId });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/detail_item/view_detail_item.ejs", {
        title: "Staycation | View Detail",
        alert,
        itemId: itemId,
        features,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // end point detail feature
  addFeatureItem: async (req, res) => {
    const { name, quantity, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "Image Not Found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        quantity,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash("alertMessage", "Succesful Add Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editFeatureItem: async (req, res) => {
    const { name, quantity, itemId, featureId } = req.body;
    const feature = await Feature.findOne({ _id: featureId });
    try {
      if (req.file == undefined) {
        Object.assign(feature, {
          name,
          quantity,
        });
        await feature.save();
        req.flash("alertMessage", "Succesful Edit Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        Object.assign(feature, {
          name,
          quantity,
          imageUrl: `images/${req.file.filename}`,
        });
        await feature.save();
        req.flash("alertMessage", "Succesful Edit Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  deleteFeatureItem: async (req, res) => {
    const { id } = req.params;
    const feature = await Feature.findOne({ _id: id });
    const item = await Item.findOne({ _id: feature.itemId });
    try {
      fs.unlink(path.join(`public/${feature.imageUrl}`));
      item.featureId.pop({ _id: feature._id });
      await feature.remove();
      await item.save();
      req.flash("alertMessage", "Succesful Delete Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${item.id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${item.id}`);
    }
  },

  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking.ejs", {
      title: "Staycation | Booking",
    });
  },
};
