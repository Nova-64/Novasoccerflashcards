"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { useRouter } from "next/navigation";
import Link from 'next/navigation';
import { Box, Card, CardContent, Container, Grid, Typography, CardActionArea } from "@mui/material";

export default function Flashcards() {
  console.log("FlashcardsPage component rendered")
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()
 
  useEffect(() => {
    async function getFlashcards() {
      if (!user)  return  
      const docRef = doc(collection(db, 'users'), user.id) 
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      }
  else {
    await setDoc(docRef, {flashcards: []})
  }
    }
    getFlashcards()
  }, [user])
  if(!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleCardClick = (id) =>{
    router.push('/flashcard?id=${id}')
  }

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3}>
        {flashcards.map((flashcard, index) => (
          <Grid item key={index} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Typography variant="h6">{flashcard.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}