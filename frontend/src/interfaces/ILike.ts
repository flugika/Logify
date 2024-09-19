import { LogInterface } from "./ILog";
import { UserInterface } from "./IUser";

export interface LikeInterface {
    ID?: number;
    LogID?: number,
    Log?: LogInterface,
    UserID?: number,
    User?: UserInterface,
}