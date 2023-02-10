import { ICharacter } from '../core/character.interface';
import { NotFound } from '../core/errors';
import { createCompletion } from '../service/ai';
import { findCharacter, saveHistory } from '../service/character';


export interface IReplyInput {
  playerId: string;
  characterId: string; 
  prompt:string; 
  tags?: string[];
}
export async function reply({playerId, characterId, prompt, tags: inputTags = []}: IReplyInput) {

  console.log(`(reply)`, {characterId, prompt, inputTags})
  const history = ''
  
  const tags = inputTags.join();

  const char = findCharacter(characterId);

  if (!char) {
    throw new NotFound();
  }

  const query = templatePrompt(char, history, prompt, tags);
  const reply = await createCompletion(query);
  
  return saveHistory({ playerId, characterId, prompt, reply, tags: inputTags, replyOptions: [], rawQuery: query, })
}

function templatePrompt(character: ICharacter, chatHistory: string, input: string, tags: string) {
  return `You are NPC character named ${character.name}
  ${character.bio}

  The following is a conversation with a character. 

  ${chatHistory}
  player: ${input}.
  `;
}
