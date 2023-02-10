import { ObjectId } from "mongoose";

export interface IHistory {
  _id: ObjectId | string
  characterId: string;
  playerId: string;
  prompt: string;
  replyOptions: string[],
  tags: string[],
  reply: string,
  rawQuery: string,
}