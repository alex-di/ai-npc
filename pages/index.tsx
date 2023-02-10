import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./index.module.css";
import { Box, Container, CardMedia, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useCharacters } from "../utils/hooks";


export default function Home() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState([]);
  const {data: characters} = useCharacters();


  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
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


  return (
    <>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <Container className={styles.main} >
        <h3>Ask NPC</h3>
        <Box sx={{ display: 'flex' }}>
          {characters?.map((char) => <Box key={char.id} sx={{ flexDirection: 'row' }}>
            <Card sx={{ maxWidth: 345, margin: 5 }}>
              <CardActionArea onClick={() => router.push(`/${char.id}`)}>
                {<CardMedia
                  component="img"
                  height="140"
                  image={char.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80'}
                  alt={char.name}
                />}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {char.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{char.bio}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>)}

        </Box>
      </Container>
    </>
  );
}
