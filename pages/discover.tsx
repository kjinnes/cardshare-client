import Searchbar from '../components/Searchbar';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { discoverySearchingService, searchBookService } from '../services/externalApi';
import IBook from '../interfaces/IBook'
import IDeck from '../interfaces/IDeck'
import Container from '../components/Container'
import ListBooks from '../components/ListBooks'

function Discover() {
  const authorized = useContext(AuthContext)
  if (!authorized) return null;
  const { currentUser } = authorized;
  const defaultBook = {title: '', src:'', OLID: ''}
  const [selectedBook, setSelectedBook] = useState<IBook>(defaultBook);

  async function handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const target = e.target as HTMLImageElement;
    if (target.title) {
      let query = target.title.split(" ").join("+");
      let searchResult = await discoverySearchingService(query, target.id);
      setSelectedBook(searchResult)
    }
  }

  return (
   <Container>
      {currentUser ? (<>
        <h3>Discover Popular Flashcard Decks</h3>
        <Searchbar setSelectedBook={setSelectedBook} />
        <ListBooks title="Popular" />
        <ListBooks title="Self-Growth" />
        <ListBooks title="History"  />
      </>) : (<div>Access unauthorized.</div>)}
  </Container>)

}

export default Discover;
