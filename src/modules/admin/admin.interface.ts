import { UserStatus } from "@prisma/client";

export interface IUpdateUserStatus {
  status: UserStatus;
}
