import { type TimeStamp } from "./common";
/**
 * UserSnap represents the structure of a user document in the database, including essential fields for authentication and profile management.
 * It extends the TimeStamp interface to include createdAt and updatedAt fields for tracking when the user was created and last updated.
 */

export interface UserSnap extends TimeStamp {
  _id: string;
  email: string;
  name: string;
  passwordHash: string;
  displayPictureUrl?: string;
  isEmailVerified: boolean;
}
