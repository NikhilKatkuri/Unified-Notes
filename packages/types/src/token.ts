import { TimeStamp } from "./common";

/**
 * Verifier represents the structure of a token used for verification purposes, such as password reset or email verification.
 * It includes fields for the user ID, token value, and expiration date, along with timestamp fields for tracking when the token was created and last updated.
 *
 */
export interface Verifier extends TimeStamp {
  _id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * PasswordResetToken and EmailVerificationToken are specific types of Verifier used for password reset and email verification processes, respectively.
 * They inherit the structure of Verifier, allowing for consistent handling of token-related operations across the application.
 */
export type PasswordResetToken = Verifier;

/**
 * EmailVerificationToken is a specific type of Verifier used for email verification processes.
 * It inherits the structure of Verifier, allowing for consistent handling of token-related operations across the application.
 */
export type EmailVerificationToken = Verifier;
