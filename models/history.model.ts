import mongoose from 'mongoose';

const { Schema } = mongoose;

const historySchema = new Schema({
  characterId: { type: String, required: true, },
  playerId: { type: String, required: true, },
  prompt:  {type: String, required: true}, // String is shorthand for {type: String}
  reply:  {type: String, required: true},
  tags: {
    mood: String,
    relation: String,
  },
  replyOptions: [{ type: String }],
  rawQuery:  {type: String, required: true},
}, { timestamps: true });

export const History = mongoose.models.History || mongoose.model('History', historySchema);