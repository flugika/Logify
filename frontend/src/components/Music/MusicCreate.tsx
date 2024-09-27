import React, { useEffect, useRef, useState } from 'react';
import { ListMoods, CreateMusic } from "../../services/HttpClientService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { setMoods, clearFilters } from '../../stores/Slice/searchSlice';
import { Box, Button, Paper, Typography, TextField, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import MoodFilter from "../Filter/MoodFilter";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

function MusicCreate() {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedMood } = useSelector((state: RootState) => state.search.data);

    const [name, setName] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [urlWithTime, setUrlWithTime] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [videoId, setVideoId] = useState<string>("");
    const [chorusTime, setChorusTime] = useState<number>(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const [openPreview, setOpenPreview] = useState(false);
    const uid = localStorage.getItem("uid") || "";
    const playerRef = useRef<YT.Player | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        let data = {
            Name: name,
            Artist: artist,
            ChorusTime: chorusTime,
            Url: url,
            UserID: parseInt(uid),
            MoodID: parseInt(selectedMood + ""),
        };
        console.log(data)

        try {
            const res = await CreateMusic(data);
            if (res.status) {
                setSuccess(true);
                setError(false);
                setAlertMessage("Added music successfully!");
                setName("");
                setArtist("");
                setUrlWithTime("");
                setUrl("")
                setChorusTime(0)
                dispatch(clearFilters());
            } else {
                setSuccess(false);
                setError(true);
                setAlertMessage(res.message || "An error occurred.");
            }
        } catch (error) {
            setSuccess(false);
            setError(true);
            setAlertMessage("An error occurred while adding the music.");
        }
    };

    function parseYouTubeUrl(url: string) {
        const videoRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const timeRegex = /[?&]t=(\d+)/;
        const videoMatch = url.match(videoRegex);
        const timeMatch = url.match(timeRegex);

        const videoId = videoMatch ? videoMatch[1] : null;
        const time = timeMatch ? parseInt(timeMatch[1], 10) : 0;

        return { videoId, time };
    }

    // Parse the YouTube URL and extract videoId and time when `urlWithTime` changes
    useEffect(() => {
        if (urlWithTime) {
            const { videoId, time } = parseYouTubeUrl(urlWithTime);
            setVideoId(videoId + "")
            setChorusTime(time);
            console.log(urlWithTime.split("?")[0])
            setUrl(urlWithTime.split("?")[0])
            console.log("Video ID:", videoId, "Chorus Time:", time);
        }
    }, [urlWithTime]);

    const videoUrl = `https://www.youtube.com/embed/${videoId}?start=${chorusTime}&autoplay=1`;

    // Fetch moods data once when component mounts
    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const moodRes = await ListMoods();
                if (moodRes) dispatch(setMoods(moodRes));
            } catch (error) {
                console.error('Error fetching moods:', error);
            }
        };

        dispatch(clearFilters());
        fetchMoods();
    }, [dispatch]);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };

    const initializePlayer = () => {
        if (iframeRef.current && videoId) {
            if (!window.YT || !window.YT.Player) {
                console.error('YouTube IFrame API is not loaded');
                return;
            }

            try {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    videoId: videoId,
                    events: {
                        onReady: () => {
                            if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                                console.log('Player ready and seekTo is available');
                            } else {
                                console.error('Player is not ready or seekTo is not available');
                            }
                        }
                    }
                });
                console.log(videoId)
                console.log(iframeRef.current)
            } catch (error) {
                console.error('Failed to initialize YouTube player:', error);
            }
        }
    };

    useEffect(() => {
        if (openPreview) {
            setTimeout(() => {
                if (iframeRef.current) {

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
                }
            }, 0);

            return () => {
                if (playerRef.current) {
                    playerRef.current.destroy();
                }
            };
        }
    }, [openPreview, videoId]);

    const handlePreview = () => {
        setOpenPreview(true);
    };

    // Handle closing of the preview modal
    const handleClosePreview = () => {
        setOpenPreview(false);
    };

    return (
        <div>
            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ alignItems: "center" }}>
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar
                open={error}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error" sx={{ alignItems: "center" }}>
                    {message}
                </Alert>
            </Snackbar>
            <Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", mb: "1rem" }}>
                    <Tooltip title="Back">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/music`)}
                            sx={{
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
                            <ArrowBackIosNewIcon sx={{ marginLeft: "4px" }} /> {/* Always visible */}
                        </Button>
                    </Tooltip>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#384137', // White text for contrast
                            fontWeight: 'bold', // Bold font for emphasis
                        }}
                    >
                        New Music
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#fafafa', marginBottom: '2rem', alignItems: "center" }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '30px',
                                '& fieldset': {
                                    borderRadius: '30px',
                                    borderColor: '#dcdcdc',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#91DBB0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#78B591',
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#384137',
                                '&.Mui-focused': {
                                    color: '#384137',
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Artist"
                        variant="outlined"
                        fullWidth
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '30px',
                                '& fieldset': {
                                    borderRadius: '30px',
                                    borderColor: '#dcdcdc',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#91DBB0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#78B591',
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#384137',
                                '&.Mui-focused': {
                                    color: '#384137',
                                },
                            },
                        }}
                    />
                    <TextField
                        label="URL"
                        variant="outlined"
                        fullWidth
                        value={urlWithTime}
                        onChange={(e) => setUrlWithTime(e.target.value)}
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '30px',
                                '& fieldset': {
                                    borderRadius: '30px',
                                    borderColor: '#dcdcdc',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#91DBB0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#78B591',
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#384137',
                                '&.Mui-focused': {
                                    color: '#384137',
                                },
                            },
                        }}
                    />
                    {/* <TextField
                        label="Cover URL"
                        variant="outlined"
                        fullWidth
                        value={cover}
                        onChange={(e) => setCover(e.target.value)}
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '30px',
                                '& fieldset': {
                                    borderRadius: '30px',
                                    borderColor: '#dcdcdc',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#91DBB0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#78B591',
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#384137',
                                '&.Mui-focused': {
                                    color: '#384137',
                                },
                            },
                        }}
                    /> */}
                    {/* <Button
                        variant="contained"
                        onClick={() => setIsURL(!isURL)}
                        sx={{ mb: 2 }}
                    >
                        {isURL ? 'Switch to File Upload' : 'Switch to URL Input'}
                    </Button> */}
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0, sm: 2 } }}>
                        <MoodFilter />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "flex-end", marginTop: "2rem" }}>
                        <Tooltip title="Preview">
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handlePreview}
                                sx={{
                                    marginLeft: '1rem',
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
                                    color: "#589E74", // Blue color for the text and icon
                                    borderColor: "#589E74",
                                    transition: 'width 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease', // Smooth transition for width change
                                    '&:hover': {
                                        width: '130px', // Expands width on hover to the right
                                        backgroundColor: '#F5FFFC',
                                        borderColor: "#4D8A65",
                                        color: "#4D8A65",
                                    },
                                    '& .button-label': {
                                        opacity: 0, // Text hidden initially
                                        transition: 'opacity 0.3s ease', // Fade in transition for text
                                        marginLeft: '10px', // Ensure text is separated from the icon
                                    },
                                    '&:hover .button-label': {
                                        opacity: 1, // Text becomes visible on hover
                                    },
                                }}
                            >
                                <VisibilityIcon sx={{ marginLeft: "4px" }} /> {/* Always visible */}
                                <span
                                    className="button-label"
                                    style={{
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Preview
                                </span>
                            </Button>
                        </Tooltip>

                        <Tooltip title="Create Log">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
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
                                        width: '126px', // Expands width on hover to the right
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
                                    Create
                                </span>
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>

                {/* Preview Modal */}
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
        </div>
    );
}

export default MusicCreate;
