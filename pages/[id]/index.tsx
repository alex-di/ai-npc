import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import characters from '../../data/chars.json';
import { Box, Container, CardMedia, Card, CardActionArea, CardContent, Typography, CircularProgress } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState([]);

  const {id} = router.query;

  const history = ''

  console.log(router)

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/generate/?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult([...result, { q: promptInput, a: data.result}]);
      setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  
  useEffect(() => {
    if(!id) {
      return;
    }
  }, [id])

  if (!id) {
    return  <CircularProgress></CircularProgress>
  }

  const char = characters.find(({ id: charId }) =>  charId === id);


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
      </Container>
    </>
  );
}

