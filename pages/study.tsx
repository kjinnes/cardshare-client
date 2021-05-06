import { AuthContext, useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect, useContext } from 'react';
import { deleteSavedDeckByIdService, getSavedDecksByEmailService } from '../services/internalApi';
import IDeck from '../interfaces/IDeck'
import ListDecks from '../components/ListDecks'
import Container from '../components/Container';
import { useRouter } from 'next/router';

function Study() {

const authorized = useContext(AuthContext);
    if (!authorized) return null;
    const { currentUser, email } = authorized;
    const router = useRouter();
    const [savedDecks, setSavedDecks] = useState<IDeck[]>([]);

    useEffect(() => {
        const sendEmail = email||currentUser.email
        if (sendEmail) {
            getSavedDecksByEmailService(sendEmail)
            .then((data) => {
                data.length && setSavedDecks(data[0].savedDecks)
            });
        };
    },[router, currentUser, email]);

    return(
        <Container>
            <h3 >My Saved Decks</h3>
            <ListDecks decks={savedDecks} setDecks={setSavedDecks} type={"savedDecks"}/>
        </Container>
    )

}

export default Study;