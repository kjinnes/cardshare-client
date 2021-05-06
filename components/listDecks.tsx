import React, { Dispatch, SetStateAction, useContext } from 'react';
import IDeck from '../interfaces/IDeck';
import { AuthContext } from '../contexts/AuthContext';
import Deck from './Deck'
import { deleteSavedDeckByIdService, deleteDeckByIdService } from '../services/internalApi'

type Props = {
    decks: IDeck[] | null,
    setDecks: Dispatch<SetStateAction<IDeck[] | null>>,
    type: String,
}

function ListDecks ({ decks, setDecks, type }:Props) {
  const authorized = useContext(AuthContext);
    if (!authorized) return null;
    const { currentUser, email } = authorized;

    const showDecks = () => {
        if (decks && decks.length === 0) {
            return <div className="noDeckAnnouncement">No Decks Available</div>
        } else if (decks) {
            return decks.map((deck) => {
                 return <div className="bookDisplay" key={deck._id}>
                     <div className="deleteButton" onClick={() => deleteHandler(deck)}>𝗫</div>
                     <Deck deck={deck} decks={decks} setDecks={setDecks} key={deck.title} type={type}/>
                </div>
            })
        }
    }

    const deleteHandler = (deck:any)=> {
        const sendEmail = email ||currentUser.email;
        const id:string = deck._id ? deck._id :deck.OLID;
        const response = confirm(`You sure you want to delete ${deck.title}?`)
        if (decks && response && type === "savedDecks") {
          deleteSavedDeckByIdService(sendEmail, id);
          let newDecks = decks.filter((sDeck) => sDeck._id !== deck._id);
          setDecks(newDecks);
        } else if (decks && response && type === "myDecks") {
          deleteDeckByIdService(sendEmail, id);
          let newDecks = decks.filter((sDeck) => sDeck._id !== deck._id);
          setDecks(newDecks);
        } else if (decks && response && type === "byBook") {
          return;
        }
    }

    return <div className="deckListing">{showDecks()}</div>;
}

export default ListDecks;