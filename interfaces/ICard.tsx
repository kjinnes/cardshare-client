export default interface ICard {
  _id?: string,
  question: string,
  answer: string,
}

export const defaultCard: ICard = { question: '', answer: '' }