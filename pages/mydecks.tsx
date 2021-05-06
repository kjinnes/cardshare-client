import { AuthContext, useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect, useContext } from 'react';
import { getDeckByEmailService } from '../services/internalApi';
import IDeck from '../interfaces/IDeck';
import ListDecks from '../components/ListDecks';
import Container from '../components/Container';
import { useRouter } from 'next/router';

function MyDecks() {

const authorized = useContext(AuthContext);
    if (!authorized) return null;
    const { currentUser, email } = authorized;
    const router = useRouter();
    const [myDecks, setMyDecks] = useState<IDeck[] | null>(null);

    useEffect(() => {
        const sendEmail = email||currentUser.email
        if (sendEmail) {
            getDeckByEmailService(sendEmail)
            .then((data) => {
                console.log(data)
                data && setMyDecks(data)
            });
        };
    },[]);

    const handleNewDeck = () => {
        router.push("/create")
    }

    return(
        <Container>
            <h3>My Decks</h3>
            <button
            type="button"
            className="buttonNewDeck"
            onClick={handleNewDeck}> Create New Deck
            </button>
            <ListDecks decks={myDecks} setDecks={setMyDecks} type={"myDecks"}/>
        </Container>
    )

}

export default MyDecks;