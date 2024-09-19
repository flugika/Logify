import { UserInterface } from "./IUser";

export interface FollowerInterface {
    ID?: number;
    UserID?: number;
    FollowerID?: number;
    User?: UserInterface;
    Follower?: UserInterface;
}