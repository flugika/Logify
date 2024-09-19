import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { AddLike, AddSave, GetLikeByLogID, GetLog, UnLike, UnSave, GetSaveByLogID, GetFollowerByUID, FollowUser, UnfollowUser, DeleteLog } from "../../services/HttpClientService";
import { LogInterface } from "../../interfaces/ILog";
import { Box, Typography, Avatar, Paper, Divider, IconButton, Slider, Stack, Fade } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import userLogo from "../../img/user.png";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { setVolume } from "../../stores/Slice/volumeSlice";
import Layout from "../Layout";
import { LikeInterface } from "../../interfaces/ILike";
import { SaveInterface } from "../../interfaces/ISave";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { FollowerInterface } from "../../interfaces/IFollower";
import Swal from "sweetalert2";
import "../utils/SweetAlert.css";
import renderArticleText from "../utils/renderArticleText"

const textStyle = {
    marginBottom: '0rem',
    lineHeight: '1.6',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'justify',
    fontWeight: 'normal',
    fontStyle: 'normal',
};

// Thai month names
const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

function LogDetail() {
    const dispatch = useDispatch();
    const params = useParams<{ id: string }>();
    const { volume } = useSelector((state: RootState) => state.volume.data);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [log, setLog] = useState<LogInterface>();
    const [like, setLike] = useState<LikeInterface[]>([]);
    const [save, setSave] = useState<SaveInterface[]>([]);
    const [playerState, setPlayerState] = useState<'playing' | 'paused'>('paused');
    const playerRef = useRef<YT.Player | null>(null);
    const [loading, setLoading] = useState(true); // State to manage iframe loading
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [likesCount, setLikesCount] = useState(0);
    const [savesCount, setSavesCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(true);
    const [hasSaved, setHasSaved] = useState(true);
    const [followers, setFollowers] = useState<FollowerInterface[]>([]);
    const [isFollowing, setIsFollowing] = useState(true);
    const uid = localStorage.getItem("uid") || "";
    const navigate = useNavigate();

    const getLog = async () => {
        try {
            const res = await GetLog(params.id);
            if (res) {
                setLog(res);
                setLikesCount(res.LikesCount || 0);
                setSavesCount(res.SavesCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch log:', error);
        }
    };

    const getFollower = async () => {
        try {
            const res = await GetFollowerByUID({
                UserID: log?.UserID,
            });
            if (res) {
                setFollowers(res);
            } else {
                setFollowers([])
            }
        } catch (error) {
            console.error('Failed to fetch log:', error);
        }
    };

    const getLikeByLogID = async () => {
        try {
            const res = await GetLikeByLogID(log?.ID || 0);
            if (res) {
                setLike(res)
            }
        } catch (error) {
            console.error('Failed to fetch log:', error);
        }
    };

    const getSaveByLogID = async () => {
        try {
            const res = await GetSaveByLogID(log?.ID || 0);
            if (res) {
                setSave(res)
            }
        } catch (error) {
            console.error('Failed to fetch log:', error);
        }
    };

    // Convert Gregorian year to Buddhist Era year
    const toThaiYear = (year: number) => year + 543;

    // Function to format the date
    const formatThaiDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = thaiMonths[d.getMonth()];
        const year = toThaiYear(d.getFullYear());
        return `${day} ${month} ${year}`;
    };

    // Function to parse YouTube URL
    function parseYouTubeUrl(url: string) {
        const videoRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const videoMatch = url.match(videoRegex);
        const videoId = videoMatch ? videoMatch[1] : null;

        return { videoId };
    }

    const { videoId } = parseYouTubeUrl(log?.Music?.URL + "")

    useEffect(() => {
        // Check if YT object is already loaded, if not, load the IFrame API
        if (!window.YT) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            document.body.appendChild(script);

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else {
            // If YT is already loaded, initialize the player immediately
            initializePlayer();
        }

        // Clean up
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.addEventListener('load', () => setLoading(false));
        }
        getLog();
    }, []);

    const initializePlayer = () => {
        if (iframeRef.current && videoId) {
            playerRef.current = new window.YT.Player(iframeRef.current, {
                videoId: videoId,
                events: {
                    onReady: () => {
                        setPlayerState("paused"); // Player is ready but stopped by default
                    },
                    onStateChange: (event: YT.PlayerEvent) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setPlayerState("playing");
                        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                            setPlayerState("paused");
                        }
                    },
                },
            });
        }
    };

    const playAndStopVideo = () => {
        if (playerRef.current) {
            if (playerState === "playing") {
                playerRef.current.pauseVideo();
                setPlayerState("paused")
            } else {
                playerRef.current.playVideo();
                setPlayerState("playing")
            }
        } else {
            console.error("Player not initialized.");
        }
    };

    const handleVolumeChange = (event: Event, newValue: number | number[]) => {
        const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
        dispatch(setVolume(newVolume));
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        } else {
            console.error("Player not initialized.");
        }
    };

    const seekToTime = (seconds: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(seconds);
        }
    };

    useEffect(() => {
        setIsFollowing(followers.some(item => item.UserID === log?.UserID && item.FollowerID === parseInt(uid)));
    }, [followers, log?.UserID, uid]);

    useEffect(() => {
        if (log) {
            const fetchData = async () => {
                await getLikeByLogID();
                await getSaveByLogID();
                await getFollower();
            };
            fetchData();
            setFollowerCount(log?.User?.FollowerCount || 0);
            console.log(log)
        }
    }, [log]);

    useEffect(() => {
        setHasLiked(like.some(item => item.UserID === parseInt(uid) && item.LogID === log?.ID));
    }, [like, log?.ID, uid]);

    useEffect(() => {
        setHasSaved(save.some(item => item.UserID === parseInt(uid) && item.LogID === log?.ID));
    }, [save, log?.ID, uid]);

    const handleDelete = async () => {
        // Show confirmation modal
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this log?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#E36951',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#4D8A65',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'confirm-button-class',
                cancelButton: 'cancel-button-class',
            },
        });

        // Check if the user confirmed the action
        if (result.isConfirmed) {
            try {
                const res = await DeleteLog(params.id || "");
                if (res) {
                    setLog({}); // Assuming you want to clear the log data
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The log has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#4D8A65',
                        customClass: {
                            confirmButton: 'confirm-button-class',
                        },
                    }).then(() => {
                        navigate('/log/my');
                    });
                }
            } catch (error) {
                console.error('Failed to delete log:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete the log. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#4D8A65',
                    customClass: {
                        confirmButton: 'confirm-button-class',
                    },
                });
            }
        }
    };

    const handleLike = async () => {
        let data = {
            LogID: log?.ID,
            UserID: parseInt(uid), // Ensure uid is defined or passed in appropriately
        };

        try {
            if (hasLiked) {
                // Unlike logic
                await UnLike(log?.ID || 0);
                setLikesCount((prev) => prev - 1); // Decrement like count
            } else {
                // Like logic
                await AddLike(data);
                setLikesCount((prev) => prev + 1); // Increment like count
            }
            setHasLiked(!hasLiked); // Toggle like state
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleSave = async () => {
        let data = {
            LogID: log?.ID,
            UserID: parseInt(uid), // Ensure uid is defined or passed in appropriately
        };

        try {
            if (hasSaved) {
                await UnSave(log?.ID || 0);
                setSavesCount((prev) => prev - 1); // Decrement save count
            } else {
                await AddSave(data);
                setSavesCount((prev) => prev + 1); // Increment save count
            }
            setHasSaved(!hasSaved); // Toggle like state
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleFollow = async () => {
        let data = {
            UserID: log?.UserID, // Ensure uid is defined or passed in appropriately
            FollowerID: parseInt(uid),
        };

        try {
            if (isFollowing) {
                await UnfollowUser(data);
                setFollowerCount((prev) => prev - 1); // Decrement save count
            } else {
                await FollowUser(data);
                setFollowerCount((prev) => prev + 1); // Increment save count
            }
            setIsFollowing(!isFollowing); // Toggle like state
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    return (
        <Layout>
            <Box>
                {/* Cover Image with Inner Shadow */}
                <Box
                    sx={{
                        width: '100%',
                        maxHeight: '440px',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundImage: `url(${log?.Cover})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        aspectRatio: '21 / 9', // 32 / 6 if pc browser
                    }}
                >
                    {/* Title Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '1rem',
                            paddingTop: '1rem',
                            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0))',
                            color: 'white',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                        }}
                    >
                    </Box>
                </Box>

                {/* Log Content */}
                <Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '2rem',
                            paddingRight: '4rem',
                            marginTop: '1rem',
                            position: 'relative', // Ensure Paper is positioned relatively for absolute child positioning
                        }}
                    >
                        {/* Like Button and Count in Top-Right Corner */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                            }}
                        >
                            {log?.UserID === parseInt(uid) && (
                                <IconButton onClick={handleDelete} sx={{ width: "40px", height: "40px" }}>
                                    <DeleteIcon sx={{ color: "#E33560" }} />
                                </IconButton>
                            )}
                            <Stack
                                direction="column"
                                alignItems="center"
                                spacing={0} // Adjust spacing between button and text
                            >
                                <IconButton onClick={handleLike}>
                                    {hasLiked ? (
                                        <ThumbUpIcon sx={{ color: "#E36951" }} />
                                    ) : (
                                        <ThumbUpOffAltIcon sx={{ color: "#E36951" }} />
                                    )}
                                </IconButton>
                                <Typography sx={{ marginTop: "-8px", justifyContent: "center" }}>{likesCount}</Typography>
                            </Stack>
                            <Stack
                                direction="column"
                                alignItems="center"
                                spacing={0} // Adjust spacing between button and text
                            >
                                <IconButton onClick={handleSave}>
                                    {hasSaved ? (
                                        <BookmarkAddedIcon sx={{ color: "#3DB068" }} />
                                    ) : (
                                        <BookmarkBorderIcon sx={{ color: "#3DB068" }} />
                                    )}
                                </IconButton>
                                <Typography sx={{ marginTop: "-8px", justifyContent: "center" }}>{savesCount}</Typography>
                            </Stack>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: { xs: 'flex-start', md: 'space-between' },
                                alignItems: { xs: 'flex-start', md: 'center' },
                                gap: 2,
                                marginTop: "1.6rem",
                                marginBottom: "1rem",
                                padding: { xs: 1, md: 2 }, // Add padding for better spacing
                                borderBottom: '1px solid #ddd', // Add a border for visual separation
                                width: "100%"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                                    fontWeight: 'bold',
                                    marginBottom: { xs: '1rem', md: 0 },
                                    flex: 1, // Make sure the title takes available space
                                    width: "82%",
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    textAlign: 'left',
                                }}
                            >
                                {log?.Title}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: { xs: 'flex-start', md: 'center' },
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    src={userLogo}
                                    alt={log?.User?.Username || 'User'}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        marginBottom: { xs: '0.5rem', md: 0 },
                                        borderRadius: '50%', // Ensure the avatar is circular
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: { xs: 'flex-start', md: 'flex-start' },
                                    }}
                                >
                                    <Typography variant="h6">
                                        {log?.User?.Username || 'Anonymous'}
                                    </Typography>
                                    {log?.UserID !== parseInt(uid)
                                        ? (
                                            <Box sx={{ display: "flex", gap: 0.3, alignItems: "center" }}>
                                                <IconButton onClick={handleFollow} sx={{ ml: "-10px" }}>
                                                    {isFollowing ? (
                                                        <FavoriteIcon sx={{ color: "#E33560" }} />
                                                    ) : (
                                                        <FavoriteBorderIcon sx={{ color: "#E33560" }} />
                                                    )}
                                                </IconButton>
                                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, justifyContent: "center" }}>
                                                    follower: {followerCount}
                                                </Typography>
                                            </Box>
                                        )
                                        : (
                                            <>
                                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                                    {formatThaiDate(new Date())}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, justifyContent: "center" }}>
                                                    follower: {followerCount}
                                                </Typography>
                                            </>
                                        )}
                                </Box>
                            </Box>
                        </Box>
                        <Typography
                            paragraph
                            className="article"
                            sx={{
                                marginTop: "1rem", // Consistent margin with title
                                marginBottom: "1rem",
                                padding: "0 1rem", // Optional padding
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                lineHeight: 1.6,
                            }}
                        >
                            {renderArticleText(log?.Article)}
                        </Typography>
                        <Divider />
                        <Box sx={{ marginTop: "0.5rem", }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Typography sx={{ ...textStyle, color: "#aaa", fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                    {log?.User?.Username} ✧*:･ﾟ
                                </Typography>
                                <Typography sx={{ ...textStyle, marginLeft: '0.4rem', color: "#aaa", fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                    {log?.CreatedAt ? formatThaiDate(log.CreatedAt) : 'Date not available'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            {/* YouTube Embed */}
            <Box sx={{ textAlign: 'center' }}>
                <Box
                    sx={{
                        width: "1",
                        height: "1",
                        visibility: 'hidden', // Hides the box but retains its space
                        // or you can use `opacity: 0` if you need the space to be occupied
                        // opacity: 0,
                        top: 0,
                        left: 0,
                    }}
                >
                    <iframe
                        width={1}
                        height={1}
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </Box>
                <Box sx={{
                    position: 'fixed',
                    bottom: 48,
                    right: { xs: 0, sm: 24 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 2,
                    padding: 2,
                    zIndex: 1000
                }}>
                    <IconButton
                        onClick={playAndStopVideo}
                        disabled={loading} // Disable button while loading
                        sx={{
                            color: "#F5FFFC",
                            backgroundColor: "#4D8A65",
                            '&:hover': {
                                backgroundColor: "#47805D", // Change this color to your desired hover color
                            },
                        }}>
                        {playerState === "playing" ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Grow animation to show/hide the volume slider */}
                        <Fade in={showVolumeControl} timeout={300}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: "#F5FFFC",
                                padding: "0 1rem",
                                borderRadius: "24px",
                                transform: showVolumeControl ? 'translateX(0)' : 'translateX(100)',
                                transition: "transform 0.5s ease-in-out" // Slide effect
                            }}>
                                <Slider
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    aria-labelledby="volume-slider"
                                    min={0}
                                    max={100}
                                    sx={{ color: '#4D8A65', width: 100 }} // Adjust the width of the slider as needed
                                />
                            </Box>
                        </Fade>
                        {/* IconButton toggles the volume control */}
                        <IconButton
                            onClick={() => setShowVolumeControl(!showVolumeControl)}
                            sx={{
                                color: "#F5FFFC",
                                backgroundColor: "#4D8A65",
                                '&:hover': {
                                    backgroundColor: "#47805D", // Change this color to your desired hover color
                                },
                            }}
                        >
                            {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </IconButton>
                    </Box>
                    <IconButton
                        onClick={() => seekToTime(log?.Music?.ChorusTime || 0)}
                        disabled={loading} // Disable button while loading
                        sx={{
                            color: "#F5FFFC",
                            backgroundColor: "#4D8A65",
                            '&:hover': {
                                backgroundColor: "#47805D", // Change this color to your desired hover color
                            },
                        }}>
                        <AudiotrackIcon />
                    </IconButton>
                </Box>
            </Box>
        </Layout>
    );
}

export default LogDetail;
