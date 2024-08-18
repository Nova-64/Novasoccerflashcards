      'use client'

      import { useUser } from "@clerk/nextjs"
      import {useEffect, useState} from 'react'
      import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
      import { db } from '@/firebase'

      import {useSearchParams} from 'next/navigation'
      import {
        Container,
        Box,
        Typography,
        Paper,
        TextField,
        Button,
        DialogTitle,
        DialogActions,
        Dialog,
        DialogContent,
        DialogContentText,
        Grid,
        Card,
        CardActionArea,
        CardContent,
      } from '@mui/material';

      export default function Flashcard(){
        const {isLoaded, isSignedIn, user} = useUser ()
        const [flashcards, setFlashcards] = useState([])
        const [flipped, setFlipped] = useState([])

        const searchParams = useSearchParams ()
        const search = searchParams.get ('id')
        const [loading, setLoading] = useState(false);
        useEffect(() => {
          async function getFlashcard() {
            if (!search || !user) return;
            setLoading(true);
            try {
              const colRef = collection(doc(db, 'users', user.id), search);
              console.log('Collection reference:', colRef);
              const docs = await getDocs(colRef);
              console.log('Fetched documents:', docs);
              const flashcards = [];
              docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
              });
              console.log('Flashcards:', flashcards);
              setFlashcards(flashcards);
            } catch (error) {
              console.error('Error fetching flashcard:', error);
            } finally {
              setLoading(false);
            }
          }
          getFlashcard();
        }, [user, search]);

        const handleCardClick = (id) => {
          setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
          }));
        }

        if(!isLoaded || !isSignedIn) {
          return <></>
        }
            
        return (
          <Container maxWidth = "100vw">
            <Grid container spacing={3} sx={{mt:4}}>
            {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'black',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: '100px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: 'absolute',
                            width: '100%',
                            height: '100px',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
            </Grid>
          </Container>
        )
      }