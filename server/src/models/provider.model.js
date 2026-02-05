const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
    businessName: { 
            type: String, 
            required: true 
        },
    description: String,
  },
);

module.exports = mongoose.model("Provider", providerSchema);
