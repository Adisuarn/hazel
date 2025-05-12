export type Contact =
  | {
    context: string
    type: string
  }
  | {}


/**
 * @category Built-in
*/

export interface ICard {
  club: string,
  contact: Contact,
  contact2: Contact,
  contact3: Contact,
  firstname: string,
  lastname: string,
  message: string,
  place: string,
  room: string,
  title: string,
}

/**
 * @category Built-in
 */
export type CardCollection = Record<string, ICard>
