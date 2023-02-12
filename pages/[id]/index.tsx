import React from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import { Box, Container, CardMedia, Card, CardActionArea, CardContent, Typography, CircularProgress, Stack, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { askCharacter, useCharacters, useCharactersHistory } from "../../utils/hooks";
import { MoodTag, RelationModifier } from '../../core/tag.inteface';
import { ICharacter } from '../../core/character.interface';

export default function Home() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState("");
  const [activeOption, setActiveOption] = useState(null);
  const [useCustom, setCustom] = useState(false);
  const [mood, setMood] = useState(MoodTag.Scared);

  
  const {data: characters} = useCharacters();
  const {id} = router.query;
  const char: ICharacter = characters?.find(({ id: charId }) => charId === id);
  
  
  useEffect(() => {
    if(!id) {
      return;
    }
  }, [id])
  const {data: history = []} = useCharactersHistory({characterId: id, playerId: 'abcd12-3423'})

  if (!id || !char) {
    return  <CircularProgress></CircularProgress>
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {

      const data = {
        prompt: useCustom ? promptInput : char.dialogue.basic.options[activeOption].prompt,
        tags: {
          mood: useCustom ? mood : char.dialogue.basic.options[activeOption].mood,
          relation: useCustom ? RelationModifier.Neutral : char.dialogue.basic.options[activeOption].relation,
          // action: useCustom ? undefined : char.dialogue.basic.options[activeOption].action,
        }
      }
      askCharacter({
        ...data,
        characterId: id,
        playerId: 'abcd12-3423',
      })
      setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      // @ts-ignore
      console.error(error);
      // alert(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <Container className={styles.main} >
        <h3 onClick={() => router.push('/')}>Ask NPC</h3>
        <Box sx={{ width: "100%", display: "flex", flexDirection: 'row' }}>
          <Card sx={{ maxWidth: 345, marginY: 5 }}>
            <CardActionArea >
              <CardMedia
                component="img"
                height="140"
                image={char.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80'}
                alt={char.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {char.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">{char.bio}</Typography>
                <Typography variant="body2" color="text.secondary">{char.dialogue.basic.setting}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Box sx={{ margin: 5}} >
            <Typography sx={{ marginBottom: 2}} variant="body1" color="text.secondary">{char.dialogue.basic.start}</Typography>
            <Stack>
              <Paper 
                  sx={ { backgroundColor: 'lightgray' , paddingY: 1, paddingX: 2, marginBottom: 1}} 
                  onClick={() => setCustom(!useCustom)}
                  elevation={3}>
                {useCustom 
                  ? <Typography>Use predefined prompt</Typography>
                  : <Typography>Use custom prompt</Typography>
                }
              </Paper>
              {!useCustom && char.dialogue.basic.options.map((opt, idx) => <Paper 
                key={idx} 
                sx={ { backgroundColor: idx === activeOption ? 'rgba(0, 255, 0)' : undefined , fontWeight: idx === activeOption ? 'bold' : 'normal', paddingY: 1, paddingX: 2, marginBottom: 1}} 

                onClick={() => setActiveOption(idx)}
                elevation={idx === activeOption ? 3 : 1}
              >
                <Typography>{opt.prompt} (causes mood: {opt.mood}, relation: {opt.relation})</Typography>
              </Paper>)}
            </Stack>
            <form onSubmit={onSubmit}>
                {useCustom && <>
                <input
                  type="text"
                  name="animal"
                  placeholder="Prompt"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  />
                 <FormControl sx={{ marginY: 3}} fullWidth>
                  <InputLabel id="mood-select-label">Mood modifier</InputLabel>
                  <Select
                    labelId="mood-select-label"
                    id="mood-select"
                    value={mood}
                    label="Mood modifier"
                    onChange={({ target }) => setMood(target.value as MoodTag)}
                  >
                    {Object.values(MoodTag).map((tag) => <MenuItem key={tag} value={tag}>{tag}</MenuItem>)}
                  </Select>
                </FormControl>
                  </>
                  }
                <input type="submit" value="Talk!" />
              </form>
            </Box>
        </Box>
        <Stack>
          {history?.map(({ reply, prompt, createdAt }, idx) => <Paper key={idx} sx={ { padding: 3, marginBottom: 2}} elevation={3}>
              
            <Typography>{createdAt} {idx === 0 && <Typography sx={{ fontSize: 10 }} color="text.secondary" component="span">Latest</Typography>}</Typography>
            <Typography 
              variant="caption"
            >You: {prompt}</Typography>
            <Typography>{reply}</Typography>
          </Paper>)}
        </Stack>
      </Container>
    </>
  );
}

