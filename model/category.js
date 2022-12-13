const mongoose = require("mongoose");
const schema = mongoose.Schema;

const catSchema = new schema(
  {
    category: {
      type: String,
      required: true,
    },
  },{timestamps:true},
);

const Category = mongoose.model("categories", catSchema);

module.exports = Category;
