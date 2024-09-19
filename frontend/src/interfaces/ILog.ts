import { CategoryInterface } from "./ICategory";
import { LikeInterface } from "./ILike";
import { MoodInterface } from "./IMood";
import { MusicInterface } from "./IMusic";
import { SaveInterface } from "./ISave";
import { UserInterface } from "./IUser";

export interface LogInterface {
    ID?: number;
    Title?: string,
    Cover?: string,
    Article?: string,
    CreatedAt?: Date,
    LikesCount?: number,
    Like?: LikeInterface,
    SavesCount?: number,
    Save?: SaveInterface,
    UserID?: number,
    User?: UserInterface,
    CategoryID?: number,
    Category?: CategoryInterface,
    MusicID?: number,
    Music?: MusicInterface,
    MoodID?: number,
    Mood?: MoodInterface,
}