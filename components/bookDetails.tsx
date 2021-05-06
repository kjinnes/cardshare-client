import React, { useEffect, useContext } from 'react'
import Container from './Container'
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/AuthContext';

type Props = {
  book:any;
}

const BookDetails = ({book}:Props) => {
  const context = useContext(AuthContext)
  if (!context) return null;
  const { email } = context;
  const router = useRouter();

  useEffect(() => {
    const html = document.getElementById('description')
    const shortDesc = book?.description?.slice(0, 750) + "..."
    if (html) html.innerHTML = shortDesc;
  },[book])

  const handleNewDeck = () => {
    router.push("/create")
  }

  return (
    <Container>
      <h2>{book.title}</h2>
      {email && <button
        type="button"
        className="buttonNewDeck"
        onClick={handleNewDeck}> Create New Deck
      </button>}
      <div className="bookgrid">
        <div>
          <img src={book.img} />
        </div>
        <div>
          {book.author && <p><span className="bold">Author: </span>{book.author}</p>}
          {book.publishedDate && <p><span className="bold">Date published: </span>{book.publishedDate}</p>}
          {book.pageCount && <p><span className="bold">Page count: </span>{book.pageCount}</p>}
          {book.averageRating && <p><span className="bold">Average rating: </span>{book.averageRating} / 5</p>}
          {book.link && <p><a href={book.link}>External Link</a></p>}
          {book.description && <>
            <p><span className="bold">Description: </span></p>
            <p><span id="description"></span></p>
          </>}
        </div>
      </div>
    </Container>
  )
}

export default BookDetails
