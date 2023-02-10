import { ICharacter } from '../core/character.interface';
import { NotFound } from '../core/errors';
import { createCompletion } from '../service/ai';
import { findCharacter, getHistory, saveHistory } from '../service/character';


export interface IReplyInput {
  playerId: string;
  characterId: string; 
  prompt:string; 
  tags?: string[];
}
export async function reply({playerId, characterId, prompt, tags: inputTags = []}: IReplyInput) {

  const rawHistory = await getHistory({ playerId, characterId })
  
  const history = rawHistory.slice(0, 3).map((h) => `
  player: ${h.prompt}
  ${h.reply}
  `)
  
  const tags = `character is annoyed by player, he doesn't want to help`;
  
  const char = findCharacter(characterId);
  
  if (!char) {
    throw new NotFound();
  }
  
  const query = templatePrompt(char, history, prompt, tags);
  const reply = await createCompletion(query);
  console.log(`(reply)`, {characterId, query})
  
  return saveHistory({ playerId, characterId, prompt, reply, tags: inputTags, replyOptions: [], rawQuery: query, })
}

function templatePrompt(character: ICharacter, chatHistory: string, input: string, tags: string) {
  return `You are NPC character named ${character.name}
  ${character.bio}
  ###
  ${tags}
  ###
  The following is a conversation with a character. 

  ${chatHistory}
  ###
  player: ${input}.
  `;
}
