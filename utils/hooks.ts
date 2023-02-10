import useSWR, { mutate } from 'swr';

export const fetcher = async (url: string, { headers = {}, method = 'GET', body = undefined } = {}) => {
    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        ...headers, 
        'content-type': 'application/json',
        'x-api-key': 'so-Secure)'
      }
    })
      .then((r) => r.json())
      .catch(e => {
        console.error(e);
        throw e;
      }) 
  }

export const useCharacters = () => {
    return useSWR(`/api/characters`, fetcher);
}
export const useCharactersHistory = ({ characterId, playerId }) => {
    return useSWR(`/api/characters/${characterId}/history?playerId=${playerId}`, fetcher);
}


export const askCharacter = async ({ characterId, playerId, prompt, tags }) => {

  await fetcher(`/api/characters/${characterId}`, {
      method: 'POST',
      body: JSON.stringify({prompt, tags, playerId }),
  })

  mutate(`/api/characters/${characterId}/history?playerId=${playerId}`) // Update the local data without a revalidation
  // router.push('/')

}