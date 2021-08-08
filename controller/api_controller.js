const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Traveller = require("../models/Booking");
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Member = require("../models/Member");
const Booking = require("../models/Booking");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit")
        .populate({ path: "imageId", select: "imageUrl", perDocumentLimit: 1 })
        .limit(5);
      const categories = await Category.find()
        .select("_id name")
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId sumBooking",
          perDocumentLimit: 4,
          options: {
            sort: { sumBooking: -1 },
          },
          populate: {
            path: "imageId",
            select: "imageUrl",
            perDocumentLimit: 1,
          },
        });
      const traveller = await Traveller.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      for (let i = 0; i < categories.length; i++) {
        for (let x = 0; x < categories[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: categories[i].itemId[x]._id });
          if (categories[i].itemId[x] === categories[i].itemId[0]) {
            item.isPopular = true;
            await item.save();
          } else {
            item.isPopular = false;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial-landingpages.svg",
        name: "Happy Couples",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Fadil Ardiansyah",
        familyOccupation: "Web Developer",
      };

      res.status(200).json({
        hero: {
          treasure: traveller.length,
          traveller: treasure.length,
          city: city.length,
        },
        mostPicked,
        categories,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "internal server error", error });
    }
  },

  detailsPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "activityId",
          select: "name type imageUrl",
        })
        .populate({
          path: "featureId",
          select: "name quantity imageUrl",
        });
      const bank = await Bank.find();
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial-landingpages.svg",
        name: "Happy Couples",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Fadil Ardiansyah",
        familyOccupation: "Web Developer",
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "internal server error", error });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      // price,
      bookingDateStart,
      bookingDateEnd,
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;
    if (!req.file) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (
      idItem === undefined ||
      duration === undefined ||
      // price === undefined ||
      bookingDateStart === undefined ||
      bookingDateEnd === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      emailAddress === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      return res.status(404).json({ message: "Lengkapi Semua File" });
    }

    try {
      const item = await Item.findOne({ _id: idItem });
      item.sumBooking += 1;
      await item.save();

      let total = item.price * duration;
      let tax = total * 0.1;

      const invoice = Math.floor(1000000 + Math.random() * 9000000);

      const member = await Member.create({
        firstName,
        lastName,
        email: emailAddress,
        phoneNumber,
      });

      const newBooking = {
        bookingStartDate: bookingDateStart,
        bookingEndDate: bookingDateEnd,
        invoice,
        itemId: {
          _id: item._id,
          title: item.title,
          price: item.price,
          duration: duration,
        },
        total: (total = +tax),
        memberId: member._id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder,
        },
      };

      const booking = await Booking.create(newBooking);
      res.status(201).json({ message: "Success Booking", booking });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error", error });
    }
  },
};
