import { useEffect, useRef, useState } from 'react';
import { ListMusics, SearchMusics } from "../../services/HttpClientService";
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import Layout from "../Layout";
import { MusicInterface } from "../../interfaces/IMusic";
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MusicNameSearch from "./MusicNameSearch";
import MusicArtistSearch from "./MusicArtistSearch";
import { setErrorMessage } from '../../stores/Slice/searchSlice';
import React from "react";

// style
// search
// filter mood

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

function MusicDetail() {
    const dispatch = useDispatch<AppDispatch>();
    const { volume } = useSelector((state: RootState) => state.volume.data);
    const { name, artist } = useSelector((state: RootState) => state.music.data);
    const { errorMessage } = useSelector((state: RootState) => state.search.data);
    const [musics, setMusics] = useState<MusicInterface[]>([]);
    const [openPreview, setOpenPreview] = useState(false);
    const [videoId, setVideoId] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const playerRef = useRef<YT.Player | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const listMusics = async () => {
        try {
            setLoading(true);
            const res = await ListMusics();
            if (res) {
                setMusics(res);
            }
        } catch (error) {
            console.error('Failed to fetch musics:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchData = async () => {
        try {
            setLoading(true);
            const res = await SearchMusics({
                artist: artist,
                name: name,
            });

            if (res) {
                setIsEmpty(false)
                setMusics(res);
            } else {
                setIsEmpty(true)
                dispatch(setErrorMessage("cannot find music"));
            }
        } catch (error) {
            console.error("Error fetching musics", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (id: number) => {
        const selectedMusic = musics.find(music => music.ID === id);
        if (selectedMusic) {
            const musicChorusTime = selectedMusic.ChorusTime + "";
            const { videoId } = parseYouTubeUrl(selectedMusic.URL + "");
            const videoUrl = `https://www.youtube.com/embed/${videoId}?start=${musicChorusTime}&autoplay=1`;
            setVideoId(videoId || "");
            setVideoUrl(videoUrl);
            setOpenPreview(true);
        }
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
    };

    function formatChorusTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    function parseYouTubeUrl(url: string) {
        const videoRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const videoMatch = url.match(videoRegex);
        const videoId = videoMatch ? videoMatch[1] : null;
        return { videoId };
    }

    const initializePlayer = () => {
        if (iframeRef.current && videoId) {
            playerRef.current = new window.YT.Player(iframeRef.current, {
                videoId: videoId,
                events: {
                    onReady: () => {
                    },
                    onStateChange: (event: YT.PlayerEvent) => {
                    }
                },
            });
        }
    };

    useEffect(() => {
        if (!window.YT) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            document.body.appendChild(script);

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else {
            initializePlayer();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.setVolume(volume);
        }
    }, [volume]);

    useEffect(() => {
        listMusics();
    }, []);

    return (
        <Layout>
            <Box sx={{ margin: '2rem 10% 4rem 10%' }}>
                <Box sx={{ alignItems: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#384137', // White text for contrast
                            fontWeight: 'bold', // Bold font for emphasis
                        }}
                    >
                        List Music
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: { xs: 0, md: 2 },
                                mt: "1rem",
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <MusicNameSearch searchData={searchData} />
                            <MusicArtistSearch searchData={searchData} />
                        </Box>

                        <Link to="/music/create" style={{ textDecoration: 'none' }}>
                            <Tooltip title="Add Music">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        marginTop: '1rem',
                                        borderRadius: '50px',
                                        minWidth: '50px',
                                        minHeight: '50px',
                                        width: '50px', // Initial width, showing only the icon
                                        overflow: 'hidden',
                                        padding: '0.5rem',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        justifyContent: 'flex-start', // Aligns content to the left
                                        alignItems: 'center',
                                        backgroundColor: "#457A5A",
                                        transition: 'width 0.3s ease, background-color 0.3s ease', // Smooth transition for width change
                                        '&:hover': {
                                            width: '154px', // Expands width on hover to the right
                                            backgroundColor: '#366147',
                                        },
                                        '& .button-label': {
                                            opacity: 0, // Text hidden initially
                                            transition: 'opacity 0.3s ease', // Fade in transition for text
                                            marginLeft: '10px',
                                        },
                                        '&:hover .button-label': {
                                            opacity: 1, // Text becomes visible on hover
                                        },
                                    }}
                                >
                                    <AddIcon sx={{ marginLeft: "4px" }} /> {/* Always visible */}
                                    <span
                                        className="button-label"
                                        style={{
                                            whiteSpace: 'nowrap',
                                            // opacity: 0, // Initially hidden
                                            // transition: 'opacity 0.3s ease', // Fade-in on hover
                                        }}
                                    >
                                        Add Music
                                    </span>
                                </Button>
                            </Tooltip>
                        </Link>
                    </Box>
                </Box>
                {loading
                    ? (
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: '5rem' }}>
                            <CircularProgress size={80} sx={{ color: "#E36951" }} />
                        </Box>
                    )
                    : (
                        <>
                            {isEmpty
                                ? (
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, paddingTop: "2rem", color: "#F5FFFC" }}>
                                        <ErrorOutlineIcon sx={{ fontSize: {xs: 30, md: 40}, filter: 'drop-shadow(6px 2px 8px rgba(0, 0, 0, 0.2))' }} />
                                        <Typography sx={{ marginTop: "-8px", fontSize: {xs: "30px", md: "40px"}, textShadow: '6px 2px 8px rgba(0, 0, 0, 0.2)' }}>
                                            {errorMessage}
                                        </Typography>
                                    </Box>
                                )
                                : (
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            margin: '1rem 0',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '12px',
                                            overflow: 'auto',
                                            width: "100%", // Full width on small screens, 95% on medium and larger
                                        }}
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#4D8A65' }}>
                                                    <TableCell sx={{
                                                        fontWeight: 'bold',
                                                        color: '#F5FFFC',
                                                        fontSize: { xs: '0.9rem', md: '1.1rem' },  // Smaller font size for xs
                                                    }}>
                                                        Name
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontWeight: 'bold',
                                                        color: '#F5FFFC',
                                                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                                                    }}>
                                                        Artist
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontWeight: 'bold',
                                                        color: '#F5FFFC',
                                                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                                                        textAlign: "center",
                                                    }}>
                                                        Mood
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontWeight: 'bold',
                                                        color: '#F5FFFC',
                                                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                                                        textAlign: "center",
                                                    }}>
                                                        Chorus Time
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontWeight: 'bold',
                                                        color: '#F5FFFC',
                                                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                                                    }}>
                                                        Preview
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {musics.map((music) => (
                                                    <TableRow
                                                        key={music.ID}
                                                        sx={{
                                                            '&:nth-of-type(odd)': { backgroundColor: '#F9F9F9' },
                                                            '&:hover': { backgroundColor: '#F1FFF9' }
                                                        }}
                                                    >
                                                        <TableCell sx={{
                                                            padding: { xs: '0.5rem', md: '0.75rem' }, // Less padding on xs
                                                            fontSize: { xs: '0.8rem', md: '1rem' },    // Adjust font size based on screen size
                                                            color: '#555'
                                                        }}>
                                                            {music.Name}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            padding: { xs: '0.5rem', md: '0.75rem' },
                                                            fontSize: { xs: '0.8rem', md: '1rem' },
                                                            color: '#555'
                                                        }}>
                                                            {music.Artist}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            padding: { xs: '0.5rem', md: '0.75rem' },
                                                            fontSize: { xs: '0.8rem', md: '1rem' },
                                                            textAlign: "center",
                                                            color: '#555'
                                                        }}>
                                                            {music.Mood?.Name}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            padding: { xs: '0.5rem', md: '0.75rem' },
                                                            fontSize: { xs: '0.8rem', md: '1rem' },
                                                            color: '#555',
                                                            textAlign: "center",
                                                        }}>
                                                            {formatChorusTime(music.ChorusTime || 0)}
                                                        </TableCell>
                                                        <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' } }}>
                                                            <Tooltip title="Preview">
                                                                <Button
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    onClick={() => handlePreview(music.ID || 0)}
                                                                    sx={{
                                                                        marginLeft: '0.5rem',
                                                                        borderRadius: '50px',
                                                                        minWidth: { xs: '36px', md: '40px' }, // Smaller button on xs
                                                                        minHeight: { xs: '36px', md: '40px' },
                                                                        width: { xs: '36px', md: '40px' },   // Ensure consistent size on smaller screens
                                                                        padding: '0.5rem',
                                                                        textTransform: 'none',
                                                                        fontWeight: 'bold',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: "#589E74",
                                                                        borderColor: "#589E74",
                                                                        transition: 'all 0.3s ease',
                                                                        '&:hover': {
                                                                            backgroundColor: '#F5FFFC',
                                                                            borderColor: "#4D8A65",
                                                                            color: "#4D8A65",
                                                                            transform: 'scale(1.05)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <VisibilityIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, color: "#4D8A65" }} /> {/* Adjusted icon size */}
                                                                </Button>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                        </>
                    )}
                <Dialog open={openPreview} onClose={handleClosePreview} fullWidth maxWidth="md">
                    <DialogTitle
                        sx={{
                            backgroundColor: "#78B591",
                            color: "#fff",
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: '1rem',
                        }}
                    >
                        Preview
                        <IconButton
                            onClick={handleClosePreview}
                            sx={{
                                position: 'absolute',
                                right: '1rem',
                                top: '1rem',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', textAlign: 'center', marginTop: "20px" }}>
                            <iframe
                                width="100%"
                                height="100%"
                                ref={iframeRef}
                                style={{ position: 'absolute', top: 0, left: 0 }}
                                src={videoUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </Layout>
    );
}

export default MusicDetail;
