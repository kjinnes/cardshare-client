import React, { useState, useContext, useEffect } from 'react';
import { AuthContext  } from '../../contexts/AuthContext';
import IDeck from '../../interfaces/IDeck'
import { useRouter } from 'next/router';
import Container from '../../components/Container';
import{ getSavedDeckByIdService } from '../../services/internalApi'

function Deck () {
    const context = useContext(AuthContext);
    if (!context || !context.currentUser.email) return null;
    const { currentUser, email } = context;
    const router = useRouter();
    const {id} = router.query;
    const [deck, setDeck] = useState<IDeck | null>(null)
    const [cardText, setCardText] = useState<any>(deck?.cards[0]?.question);
    const [textType, setTextType] = useState<string>("Question:")
    const[card, setCard] =useState<any>(deck?.cards[0]);
    const [index, setIndex] = useState<number>(0)
    const [front, setFront] = useState(true)

    useEffect(() => {
      console.log(currentUser, email)
        const sendEmail = currentUser.email || email;
        if(sendEmail) {
          getSavedDeckByIdService(sendEmail, id)
          .then(data => {
            setDeck(data);
            setCardText(data.cards[0].question)
            setCard(data.cards[0]);
          })
        }
    }, [router, currentUser])

  const handleMove = (inc:number) : void => {
    setFront(true)
    setCard(deck?.cards[index+inc]);
    setCardText(deck?.cards[index+inc].question)
    setTextType("Question:");
    setIndex(index+inc);
  }

  return deck && card ? (
    <Container>
      <h3>{deck?.title}</h3>
      <p className="deckCreator">Created by:{` ${deck?.creator}`}</p>
      <div className="flash-container">
        <button
          disabled={index === 0}
          className="flashCardButton"
          onClick={() => handleMove(-1)}
          type="button"
        >
          Previous
        </button>
        <div className="flip-container flashcard">
          <div
            className={"card-container " + (front ? "" : "flipped")}
            onClick={() => setFront(!front)}
          >
            <div className="front">
              <h3>Question #{index + 1}</h3>
              <p>{card.question}</p>
            </div>
            <div className="back">
              <span className="flashcardAnswer">Answer: </span>
              <p>{card.answer}</p>
            </div>
          </div>
        </div>
        <button
          disabled={index === deck?.cards?.length - 1}
          onClick={() => handleMove(1)}
          className="flashCardButton"
          type="button"
        >
          Next
        </button>
      </div>
    </Container>
  ) : (
    <div>loading...</div>
  );
}

export default Deck;
