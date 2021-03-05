module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard.ejs");
  },
  viewCategory: (req, res) => {
    res.render("admin/category/view_category.ejs");
  },
  viewBank: (req, res) => {
    res.render("admin/bank/view_bank.ejs");
  },
  viewitem: (req, res) => {
    res.render("admin/item/view_item.ejs");
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking.ejs");
  },
};
