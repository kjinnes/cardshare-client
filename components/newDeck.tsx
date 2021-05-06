import React, { useEffect, useState, Dispatch, SetStateAction, useContext } from 'react';
import { useRouter } from 'next/router'
import { AuthContext } from '../contexts/AuthContext';
import { getUserService, newDeckService } from '../services/internalApi';
import ICard from '../interfaces/ICard'
import Searchbar from './Searchbar'
import IDeck, { defaultDeck } from '../interfaces/IDeck'
import { defaultCard } from '../interfaces/ICard'
import FormControlElement from '../interfaces/FormControlElement'
import Container from './Container'
import Card from './Card'
import { Carousel } from 'react-responsive-carousel'
import Dropdown from 'react-dropdown'
import { TextField } from '@material-ui/core'
import 'react-dropdown/style.css';
// import "react-responsive-carousel/lib/styles/carousel.min.css";


type Props = {
  setClickedItem: Dispatch<SetStateAction<string>>,
}

const NewDeck = ({ setClickedItem }: Props) => {
  const context = useContext(AuthContext)
  if (!context) return null;

  const router = useRouter();
  const genreOption:Array<string> =[
    'Self-Growth', 'History'
  ]
  const defaultOption = genreOption[0];

  const email = context?.currentUser.email;
  let username = context.username;
  let newDefaultDeck = defaultDeck;
  newDefaultDeck.cards = [{question: '', answer: ''}]
  const [newDeck, setNewDeck] = useState<IDeck>(newDefaultDeck);

  const handleDeckChange = (e: React.ChangeEvent<FormControlElement>): void => {
    const { name, value } = e.target;
    setNewDeck({ ...newDeck, [name]: value, })
  }

  const handleGenreChange = (option: any) => {
    setNewDeck({
      ...newDeck,
      genre: option.value
    })
  }

  const handleCardChange = (e: React.ChangeEvent<FormControlElement>): void => {
    const { name, value } = e.target as FormControlElement;
    const { id } = e.target.form as HTMLElement;
    let cardArray = [...newDeck.cards] as any[]
    cardArray[Number(id)][name] = value
    setNewDeck({
      ...newDeck,
      cards: cardArray
    })
  }

  function handleRemoveClick(index: number): void {
    let cardArray = [...newDeck.cards]
    cardArray.splice(index, 1)
    setNewDeck({
      ...newDeck,
      cards: cardArray
    })
  }

  function handleAddClick(): void {
    setNewDeck({
      ...newDeck,
      cards: [...newDeck.cards, { question: '', answer: '' }]
    })
  }

  async function handleSubmit (e: React.MouseEvent<HTMLElement, MouseEvent>): Promise<any> {
    if (!username) {
      username = await getUserService(email)
    }
    const submitDeck = {
      ...newDeck,
      creator: username
    }
    e.preventDefault();
    await newDeckService(email, submitDeck)
    newDefaultDeck = defaultDeck;
    newDefaultDeck.cards = [{question: '', answer: ''}]
    await setNewDeck(newDefaultDeck)

    router.push('/mydecks')

  }

  return (
    <Container >
      <Card option="strong bg">
        <h3>New Deck</h3>
        <Searchbar setNewDeck={setNewDeck} newDeck={newDeck} /><br />
        <Dropdown
          className="formDropdown"
          options={genreOption}
          value={newDeck.genre}
          placeholder="Select a Genre"
          onChange={(option) => handleGenreChange(option)}
        />
        <TextField
          className="textfield"
          type="text"
          label="Description"
          name="description"
          value={newDeck.description}
          onChange={handleDeckChange}
        />
        <Carousel selectedItem={newDeck.cards.length - 1} showThumbs={false}>
          {newDeck.cards.map((card: ICard, index: number) => (
            <Card option="small" key={index}>
              Flashcard {index + 1}
              <a
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => handleRemoveClick(index)}
              >
                <img style={{ width: "20px" }} src="/delete.png" />
              </a>
              <form id={index.toString()}>
                <TextField
                  className="textfield"
                  type="text"
                  name="question"
                  label="Question"
                  value={card.question}
                  onChange={handleCardChange}
                />
                <TextField
                  className="textfield"
                  type="text"
                  name="answer"
                  label="Answer"
                  value={card.answer}
                  onChange={handleCardChange}
                />
              </form>
            </Card>
          ))}
        </Carousel>
        <div className="center">
        <button
          className="saveButton"
          type="button"
          onClick={() => handleAddClick()}
        >
          Add Card
        </button>

        <button
          className="saveButton"
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Save Deck
        </button>
        <button
          className="saveButton"
          type="button"
          onClick={() => setClickedItem("")}
        >
          Cancel
        </button>
        </div>
      </Card>
    </Container>
  );
}



export default NewDeck;
