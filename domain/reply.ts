import { ICharacter } from '../core/character.interface';
import { NotFound } from '../core/errors';
import { ITagInput } from '../core/tag.inteface';
import { createCompletion } from '../service/ai';
import { findCharacter, getHistory, saveHistory } from '../service/character';
import { processTags } from '../service/tags';


export interface IReplyInput {
  playerId: string;
  characterId: string; 
  prompt:string; 
  tags?: ITagInput;
}
export async function reply({playerId, characterId, prompt, tags: inputTags }: IReplyInput) {

  const rawHistory = await getHistory({ playerId, characterId })
  
  // console.log(rawHistory)
  const char = findCharacter(characterId);
  
  if (!char) {
    throw new NotFound();
  }
  
  
  const QUERY_HISTORY_LIMIT = 5;
  let history = rawHistory.slice(0, QUERY_HISTORY_LIMIT).reverse().map((h) => `
  player: ${h.prompt}
  ${h.reply}
  `)

  if (rawHistory.length < 5) {
    history = `${char.name}: ${char.dialogue.basic.start} 
    ` + history
  }
  
  const query = templatePrompt(char, history, prompt, processTags(inputTags, char, rawHistory.slice(0, 15)), char.dialogue.basic.setting);
  const reply = await createCompletion(query);
  console.log(`(reply)`, {characterId, query, reply})
  
  return saveHistory({ playerId, characterId, prompt, reply, tags: inputTags, replyOptions: [], rawQuery: query, })
}

function templatePrompt(character: ICharacter, chatHistory: string, input: string, tags: string, setting: string) {
  return `You are NPC character named ${character.name}
  ${character.bio}
  ###
  Make full and colorful answer accoding to player considering following: ${tags}, ${setting}
  ###
  The following is a conversation with a character.
  ${chatHistory}
  player: ${input}.
  `;
}
