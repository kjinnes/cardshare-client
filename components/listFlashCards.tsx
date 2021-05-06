import React, { useState, Dispatch, SetStateAction, useContext } from 'react';

import IDeck from '../interfaces/IDeck';

import Container from './Container';

type Props = {
    deck: IDeck,
}

function ListFlashcards ({ deck}:Props) {

    const showCards = () => {
        if (deck?.cards.length === 0) {
            return <div className="noDeckAnnouncement">No Flashcards Available</div>
        } else {
            return deck.cards.map((card) => {
                 return <div className="deckViewFlashcards" key={card._id}>
                    <div className="deckViewFlashcardsTitle">Question:</div>
                    <div className="deckViewFlashcardsContent">{card.question}</div>
                    <div className="deckViewFlashcardsTitle">Answer:</div>
                    <div className="deckViewFlashcardsContent">{card.answer}</div>
                </div>
            })
        }
    }

    return(
        <Container>
            <div className="deckListing">
                {showCards()}
            </div>
        </Container>
    )
}

export default ListFlashcards;