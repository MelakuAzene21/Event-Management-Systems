const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vendorSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: false }, // Password field added
      serviceProvided: { type: String, required: false ,default: "photographer" }, // What service they offer
      role: { type: String, default: "vendor"},
      avatar: { type: String, default: "default.jpg" }, // Profile picture URL
      files: [{ type: String, required: false }], // Array of file URLs (e.g., licenses, certificates)
      rating: { type: Number, default: 0, min: 0, max: 5 }, // Vendor rating
      isApproved: { type: Boolean, default: false }, // Requires admin approval
  
      // New fields added
      price: { type: String, required: false,default:" 50 birr per hour" }, // Price field (optional)
      portfolio: [
        {
          title: { type: String, required: false , default:" 50 birr per hour"},  // Title of the portfolio item
          image: { type: String, required: false }, // Image URL for the portfolio item
          description: { type: String, required: false,  default:" 50 birr per hour" }, // Optional description
        },
      ], // Array of portfolio items
      description: { type: String, required: false }, // General description of the vendor
      availability: { type: String, default: "As needed" }, // Availability status
      location: { type: String, required: false,default: "debretabor" }, // Location of the vendor
    },
    { timestamps: true }
  );

//  Hash password before saving
vendorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords for login
vendorSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Vendor", vendorSchema);
