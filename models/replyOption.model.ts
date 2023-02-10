import mongoose from 'mongoose';

const { Schema } = mongoose;

const replyOptionSchema = new Schema({
  characterId: { type: String, required: true, },
  playerId: { type: String, required: true, },
  prompt:  {type: String, required: true}, // String is shorthand for {type: String}
  reply:  {type: String, required: true},
  tags: [{ type: String }],
  replyOptions: [{ type: String }]
}, { timestamps: true });

export const ReplyOption = mongoose.models.ReplyOption || mongoose.model('ReplyOption', replyOptionSchema);