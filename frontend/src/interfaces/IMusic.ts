import { MoodInterface } from "./IMood";

export interface MusicInterface {
    ID?: number;
    Name?: string,
    Artist?: string,
    URL?: string,
    ChorusTime?: number,
    MoodID?: number,
    Mood?: MoodInterface,
}