import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import { Box, Container, CardMedia, Card, CardActionArea, CardContent, Typography, CircularProgress, Stack, ListItem, Paper } from "@mui/material";
import { findCharacter } from "../../service/character";
import { askCharacter, useCharacters, useCharactersHistory } from "../../utils/hooks";

export default function Home() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState([]);

  
  const {data: characters} = useCharacters();
  const {id} = router.query;
  const char = characters?.find(({ id: charId }) => charId === id);
  
  
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
      askCharacter({ characterId: id, prompt: promptInput, tags: [], playerId: 'abcd12-3423' })
      setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <Container className={styles.main} >
        <h3>Ask NPC</h3>
        <Box sx={{ display: "flex", flexDirection: 'row' }}>
          <Card sx={{ maxWidth: 345, margin: 5 }}>
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
              </CardContent>
            </CardActionArea>
          </Card>
          <Box sx={{ margin: 5}} >
            
          <form onSubmit={onSubmit}>
              <input
                type="text"
                name="animal"
                placeholder="Prompt"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
              />
              <input type="submit" value="Ask!" />
            </form>
            {result.map((item) => <>
              <div className={styles.question}>{item.q}</div>
              <div className={styles.result}>{item.a}</div>
            </>)}
          </Box>
        </Box>
        <Stack>
          {history?.map(({ reply, prompt, createdAt }, idx) => <Paper sx={ { padding: 3, marginBottom: 2}} elevation={3}>
              
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

