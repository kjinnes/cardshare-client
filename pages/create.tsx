import React, { useState, useEffect, useContext } from 'react';
import NewDeck from '../components/NewDeck';
import { AuthContext } from '../contexts/AuthContext';
import { getDeckByEmailService, deleteDeckByIdService } from '../services/internalApi'
import IDeck from '../interfaces/IDeck'

function Create() {
  const [deleteCount, setDeleteCount] = useState<number>(0);
  const [deckList, setDeckList] = useState<IDeck[]>([]);
  const [clickedItem, setClickedItem] = useState<string>('');
  const URL:string = "http://localhost:3001/myDecks";
  const context = useContext(AuthContext);
  if (!context) return null;
  const { currentUser, email } = context;

  useEffect(() => {
    let emailArg = email || currentUser.email;
    if (emailArg) {
      getDeckByEmailService(emailArg)
      .then(res => {
        res && setDeckList(res);
      })
    }
  }, [clickedItem]);

    return (
        <NewDeck setClickedItem={setClickedItem} />
    );

}

const deckStyle = {
  height: "220px",
  width: "150px",
  fontSize: "20px",
  border: "1px solid rgba(0,0,0,.125)",
  borderRadius: ".25rem",
  padding: "2px",
};

export default Create;
