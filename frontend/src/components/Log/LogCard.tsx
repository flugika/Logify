import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Grid } from '@mui/material';
import { LogInterface } from '../../interfaces/ILog';
import { Category, Mood, MusicNote, Person } from '@mui/icons-material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

interface CardLogProps {
    log: LogInterface;
}

const CardLog: React.FC<CardLogProps> = ({ log }) => {

    const cleanText = (input: string | undefined) => {
        if (!input) return '';
        // Replace newline characters with a space and remove specific unwanted special characters (e.g., @, @@)
        return input.replace(/\\n/g, ' ').replace(/[@~`$*"]/g, '').trim(); // Adjust the regex to include any characters you want to clean
    };

    const cleanedArticle = cleanText(log.Article);

    const truncatedArticle = cleanedArticle.length > 72
        ? `${cleanedArticle.substring(0, 72)}...`
        : cleanedArticle || 'No article available';

    const truncatedTitle = log.Title && log.Title.length > 25
        ? `${log.Title.substring(0, 25)}...`
        : log.Title || 'No title available';

    const truncatedMusic = log.Music?.Name && log.Music?.Name.length > 32
        ? `${log.Music?.Name.substring(0, 32)}...`
        : log.Music?.Name || 'No music available';

    return (
        <Card
            sx={{
                width: 345,
                height: 400,
                margin: '1rem',
                boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.2)',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                backgroundColor: 'background.paper',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '6px 6px 10px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            {log.Cover && (
                <CardMedia
                    component="img"
                    height="140"
                    image={log.Cover}
                    alt={log.Title || 'Log Cover'}
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <CardContent sx={{ flexGrow: 1, padding: '1rem', color: 'text.primary' }}>
                <Typography component="div" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'success.main' }}>
                    {truncatedTitle}
                </Typography>
                <Typography variant="body2" sx={{ color: "#8C8C8C", fontSize: "1rem" }}>
                    {truncatedArticle}
                </Typography>
            </CardContent>
            <Box sx={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Category fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {log.Category?.Name || 'Unknown'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mood fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {log.Mood?.Name || 'Unknown'}
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MusicNote fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {truncatedMusic}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    color: 'text.primary',
                }}
            >
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: "1rem", }}>
                    <Person fontSize="small" sx={{ color: 'text.primary' }} />
                    <span>{log.User?.Username || 'Unknown'}</span>
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ThumbUpIcon fontSize="small" sx={{ color: "#E36951" }} />
                        <Typography variant="body2" sx={{ fontSize: "1rem", }}>
                            {log.LikesCount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookmarkIcon fontSize="small" sx={{ color: "#3DB068" }} />
                        <Typography variant="body2" sx={{ fontSize: "1rem", }}>
                            {log.SavesCount}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default CardLog;
