const openLib = 'http://openlibrary.org/search.json?title=';
const googleBooksURI = 'https://www.googleapis.com/books/v1/volumes?q='
const apiKey = (process.env.googleBooks as string)
const bookById = 'https://www.googleapis.com/books/v1/volumes/'


export const searchBookService = (query: string): Promise<any> => {
  console.log(process.env.googleBooks)
  return fetch(`${googleBooksURI}${query}&${apiKey}`)
  .then(res => res.json())
  .then(data => {
    return data.items;
  });
}

export const discoverySearchingService = async (query: string, id: string):Promise<any> => {
  let result = await searchBookService(query);
  let book = result.find((match:any) => match.id===id);
  return {
    title:book.volumeInfo.title,
    src: book.volumeInfo.imageLinks.thumbnail,
    OLID: id
  }
}

export const getBookDetailsService = async (id: string): Promise<any> => {
  return fetch(`${bookById}${id}`)
    .then(res => res.json())
    .then(data => {
      let bookObject = {
        title: data.volumeInfo.title,
        publishedDate: data.volumeInfo.publishedDate,
        description: data.volumeInfo.description,
        pageCount: data.volumeInfo.pageCount,
        averageRating: data.volumeInfo.averageRating,
        img: data.volumeInfo.imageLinks.thumbnail,
        link: data.volumeInfo.previewLink,
        author: ''
      }
      if (data.volumeInfo.authors) {
        let authors: string = '';
        if (data.volumeInfo.authors.length === 1) {
          bookObject.author = data.volumeInfo.authors[0]
        } else {
          data.volumeInfo.authors.forEach((author: string) => {
            authors = authors + " & " + author
          })
          authors = authors.slice(2)
          bookObject.author = authors;
        }
      }
      return bookObject;
    })
}