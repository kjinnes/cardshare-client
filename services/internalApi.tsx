const URL = 'http://localhost:3001'
import IDeck from '../interfaces/IDeck';

export const getUserService = (email:string) : Promise<any> => {
  return fetch(`${URL}/users/${email}`)
  .then(data=>data.json())
}

export const newDeckService = (email: string|undefined, body: any): Promise<any> => {
  body = JSON.stringify(body)
  return fetch(`${URL}/myDecks/${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
    },
    body,
  })
    .then(data => {
      return data.json();
    });
}

export const getDeckByEmailService = (email:string): Promise<IDeck[]> => {
  return fetch(`${URL}/myDecks/${email}`)
    .then(res => res.json())
    .then(data => {
      let deckList = data[0] ? data[0].myDecks : null;
      return deckList;
    })
}

export const deleteDeckByIdService = (email:string, id:string) : Promise<any> => {
  return fetch(`${URL}/myDecks/${email}-${id}`,{
    method:'DELETE',
  })
}

export const deleteSavedDeckByIdService = (email:string, id:string) : Promise<any> => {
  return fetch(`${URL}/savedDecks/${email}-${id}`,{
    method:'DELETE',
  })
}

export const getSavedDeckByIdService = (email:string, id:any) : Promise<any> => {
  return fetch(`${URL}/savedDeck/${email}-${id}`)
  .then(res=>res.json())
}

export const getMyDeckByIdService = (email:string, id:any) : Promise<any> => {
  return fetch(`${URL}/myDeck/${email}-${id}`)
  .then(res=>res.json())
  .then(data => {
    return data
  })
}

export const getDeckByIdService = (id: string): Promise<IDeck | null> => {
  console.log(id)
  return fetch(`${URL}/discover/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if (data[0]){
        const result = {
          _id: data[0].myDecks[0]._id,
          title: data[0].myDecks[0].title,
          description: data[0].myDecks[0].description,
          src: data[0].myDecks[0].src,
          votes: data[0].myDecks[0].votes,
          cards: data[0].myDecks[0].cards,
          genre: data[0].myDecks[0].genre,
          OLID: data[0].myDecks[0].OLID,
          creator: data[0].username,
        }
        return result;
      } else return null;
    })
}

export const discoverBookService = (OLID: string): Promise<IDeck[]> => {
  return fetch(`${URL}/discover/OLID/${OLID}`)
    .then(res => res.json())
    .then(data => {
      let allDecks: IDeck[] = [];
      data.forEach((match: any) => match.myDecks.forEach((deck: IDeck) => {
        deck.creator = match.username;
        allDecks.push(deck);
      }));
      return allDecks;
    })
}
// TEXT vs JSON
export const signUpService = async (body: any): Promise<any> => {
  return await fetch(`${URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.text())
}

// TEXT VS JSON
export const saveDeckService = (email: string, selectedDeck: any): Promise<any> => {
  return fetch(`${URL}/savedDecks/${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedDeck)
  })
    .then(res => res.text())
}

// TEXT VS JSON
export const voteService = (id: string, direction: string): Promise<any> => {
  return fetch(`${URL}/discover/vote/${id}-${direction}`, {
    method: 'GET',
  })
  .then(res => res.text())
}

export const getDecksByGenreService = (genre: string): Promise<any> => {
  if (genre === 'Popular') {
    return fetch(`${URL}/discover`)
      .then(res => res.json())
  } else {
    return fetch(`${URL}/discover/genre/${genre}`)
      .then(res => res.json())
  }
}

export const getSavedDecksByEmailService = (email: string): Promise<any> => {
  console.log(email)
  return fetch(`${URL}/savedDecks/${email}`)
    .then(res => res.json())
}