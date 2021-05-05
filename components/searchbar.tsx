import React, { useState, Dispatch, SetStateAction } from 'react';
import { Form } from 'react-bootstrap';
import { searchBookService } from '../services/externalApi'
import IBook from '../interfaces/IBook'
import FormControlElement from '../interfaces/FormControlElement'
import TextField from '@material-ui/core/TextField'

type Props = {
  setSelectedBook?: Dispatch<SetStateAction<IBook>>,
  setNewDeck?: Dispatch<SetStateAction<any>>,
  newDeck?: any,
}

function Searchbar({ setSelectedBook, setNewDeck, newDeck }: Props): JSX.Element {
  const [results, setResults] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [time, setTime] = useState(0)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<any> => {
    setInput(e.target.value)
    if (!e.target.value) setResults([])
  }

  const delay = async () => {
    let newTime = new Date().getTime();
    if (newTime - time > 200) {
      if (input === '') setResults([]);
      else {
        let query = input.split(' ').join('+');
        let result = await searchBookService(query);
        setResults(result);
    }
    }
    setTime(newTime)
  }

  function handleClick(e: React.MouseEvent<HTMLImageElement>) {
    const target = e.target as HTMLImageElement;
    if (setNewDeck) {
      setNewDeck({
        ...newDeck,
        title: target.title,
        src: target.src,
        OLID: target.id,
      });
      setInput(target.title);
    }
    else if (setSelectedBook) {
      setSelectedBook({
        title: target.title,
        src: target.src,
        OLID: target.id
      });
      setInput('');
    }
    setResults([]);
  }

  return (
    <div className="searchdiv">
      <TextField
        className="searchbar"
        onKeyUp={delay}
        value={input}
        label="What book are you looking for?"
        onChange={handleChange}
      />
      {results.length > 0 && <div className="resultsdiv">
        {results.map((book: any) => {
          return (
            <div
              className="resultbook"
              key={book.id}
              onClick={handleClick}
            >
              { book.volumeInfo.imageLinks ? (
                <>
                <h2>{book.volumeInfo.title}</h2>
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  className="resultbookimg"
                  title={book.volumeInfo.title}
                  id={book.id}
                  />
                </>
              ) :
                <div>{book.volumeInfo.title}</div>
              }
            </div>
          )
        })}
      </div>

          }

    </div>
  )
}

export default Searchbar;
