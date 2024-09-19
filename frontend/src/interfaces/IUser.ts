import { MoodInterface } from "./IMood";

export interface UserInterface {
    ID?: number;
    Username?: string;
    Firstname?: string;
    Lastname?: string;
    Email?: string;
    Password?: string;
    Telephone?: string;
    Gender?: string;
    Province?: string;
    Role?: string;
    FollowerCount?: number;
    FollowingCount?: number;
}
