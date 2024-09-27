import {
    Loyalty,
    TheaterComedy,
    Chat,
    Handshake,
    TipsAndUpdates,
    AutoStories,
} from '@mui/icons-material';
import { CategoryInterface } from "../../interfaces/ICategory";

export const categories: { [key: string]: CategoryInterface } = {
    "บทความสั้น": { ID: 1, Name: "บทความสั้น", Icon: <Loyalty sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> },
    "ระบาย": { ID: 2, Name: "ระบาย", Icon: <TheaterComedy sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> },
    "เรื่องย่อ": { ID: 3, Name: "เรื่องย่อ", Icon: <Chat sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> },
    "แรงบันดาลใจ": { ID: 4, Name: "แรงบันดาลใจ", Icon: <Handshake sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> },
    "ความรู้": { ID: 5, Name: "ความรู้", Icon: <TipsAndUpdates sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> },
    "นิยาย": { ID: 6, Name: "นิยาย", Icon: <AutoStories sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> },
};