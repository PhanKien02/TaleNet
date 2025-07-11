// Original file: proto/user.proto

import type { User as _user_User, User__Output as _user_User__Output } from '../user/User';

export interface UserUpdatePayLoad {
  'id'?: (string);
  'user'?: (_user_User | null);
}

export interface UserUpdatePayLoad__Output {
  'id'?: (string);
  'user'?: (_user_User__Output);
}
