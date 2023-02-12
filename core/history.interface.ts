import { ObjectId } from "mongoose";
import { ActionStatus, ActionTag } from "./action.interface";
import { ITagInput } from "./tag.inteface";

export interface IHistory {
  _id: ObjectId | string
  characterId: string;
  playerId: string;
  prompt: string;
  replyOptions: string[],
  tags: ITagInput,
  reply: string,
  rawQuery: string,
  action?: ActionTag,
  actionStatus?: ActionStatus
}