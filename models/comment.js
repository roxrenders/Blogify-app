const { Schema, model, SchemaType } = require("mongoose");
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
      },
    blogId:{
        type: Schema.Types.ObjectId,
        ref: "blog",
      },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },

},{timestamps:true}
);

const comment =  model('comment', commentSchema);

module.exports = comment;