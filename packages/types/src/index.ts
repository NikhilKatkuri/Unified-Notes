/**
 * This package specifically created to centralize all the types related to unified Notes app.
 *
 * This will help in maintaining consistency across the application and also make it easier to manage and update types in one place.
 *
 *  github - NikhilKatkuri
 */

import * as User from "./user";
import * as Session from "./session";
import * as Token from "./token";
import * as Common from "./common";
const Unified = {
  User,
  Session,
  Token,
  ...Common,
};

export default Unified;
