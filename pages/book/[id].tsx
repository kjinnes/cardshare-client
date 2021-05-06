import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BookDetails from '../../components/BookDetails'
import ListDecks from '../../components/ListDecks'
import { getBookDetailsService } from '../../services/externalApi'
import { discoverBookService } from '../../services/internalApi'
import IDeck from '../../interfaces/IDeck';

const BookDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<any>(null);
  const [decks, setDecks] = useState<IDeck[] | null>(null);

  useEffect(() => {
    const getBookDetails = async () => {
      if (id) {
        const queryId = id.toString();
        let bookResult = await getBookDetailsService(queryId);
        setBook(bookResult)

        const deckResult = await discoverBookService(queryId);
        setDecks(deckResult);
      }
    }
    getBookDetails();

  },[id])
console.log(decks)
  return (book &&
    <div>
      <BookDetails book={book} />
      <div className="bookTitle center">Available Decks</div>
      {decks && <ListDecks decks={decks} setDecks={setDecks} type="byBook" />}
    </div>
  )
}

export default BookDetailPage
