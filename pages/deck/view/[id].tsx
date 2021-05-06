import React, { useState, useContext, useEffect, } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import IDeck from "../../../interfaces/IDeck";
import { useRouter } from "next/router";
import Container from "../../../components/Container";
import ListFlashcards from "../../../components/ListFlashCards";
import {
  getDeckByIdService,
  getUserService,
  voteService,
  getSavedDecksByEmailService,
  saveDeckService,
} from "../../../services/internalApi";

function ViewDeck() {
  const context = useContext(AuthContext);
  if (!context || !context.currentUser.email) return null;
  const { currentUser, email } = context;
  const router = useRouter();
  const { id } = router.query;
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [downvoted, setDownvoted] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const setState = async (email: string) => {
    if (id) {
      const sendId = id.toString();
      let deck = await getDeckByIdService(sendId);
      setDeck(deck);
      let user = await getUserService(email);
      user.length && setUsername(user[0].username);
    }
  };

  useEffect(() => {
    const sendEmail = currentUser.email || email;
    if (sendEmail) {
      setState(sendEmail);
    }
  }, [router, downvoted, upvoted]);

  const handleSave = () => {
    const sendEmail = currentUser.email || email;
    getSavedDecksByEmailService(sendEmail)
      .then((data) => {
        const dupes = data[0].savedDecks.filter((book: any) => {
          return book._id === deck?._id;
        });
        if (dupes.length !== 0) {
          alert("Already in your study decks.");
        } else {
          saveDeckService(sendEmail, deck).then(() => router.push("/study"));
        }
      });
  };

  const voteHandler = (direction: string) => {
    if (deck) {
      let stringId = deck._id as string;
      if (direction === "up" && upvoted === false) {
        deck && voteService(stringId, direction);
        setUpvoted(true);
      } else if (direction === "down" && downvoted === false) {
        deck && voteService(stringId, direction);
        setDownvoted(true);
      }
    }
  };

  return deck ? (
    <Container>
      <div className="deckViewInfo">
        <img className="deckViewBookCover" src={deck.src} />
        <div className="deckViewInfoRight">
          <div className="deckViewInfoRightTitle">{deck?.title}</div>
          <div className="deckViewInfoRightDescription">
            {deck?.description}
          </div>
          <div className="deckViewInfoRightCreator">
            Created by:{` ${deck?.creator}`}
          </div>

          <div className="deckViewInfoRightVotes">
            {username !== deck?.creator && (
              <span className="voteButton" onClick={() => voteHandler("up")}>
                👍
              </span>
            )}
            {`  Votes:`}
            <span>{` ${deck?.votes}  `}</span>
            {username !== deck?.creator && (
              <span className="voteButton" onClick={() => voteHandler("down")}>
                👎
              </span>
            )}
          </div>
          <button type="button" className="saveButton" onClick={handleSave}>
            Save Deck
          </button>
        </div>
      </div>
      <div className="deckViewFlashcardBottom">
        <div className="deckViewFlashcardHeader">Flashcards</div>
        <ListFlashcards deck={deck} />
      </div>
    </Container>
  ) : (
    <div>loading...</div>
  );
}

export default ViewDeck;
