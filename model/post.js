const mongoose = require("mongoose");
const schema = mongoose.Schema;

const blogSchema = new schema(
  {
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
        type: String,
        Enum:['PROGRAMMING','MUSIC','SPORT','FOOD']
      },
    image: {
      type: String,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },
  },{ timestamps: true }
);

blogSchema.index({
  title:'text',
  snippet:'text',
  body:'text'
})

const Post = mongoose.model("Posts", blogSchema);

module.exports = Post;
