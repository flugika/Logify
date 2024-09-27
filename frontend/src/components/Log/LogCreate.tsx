import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CreateLog, ListMoods, ListCategories, GetUser } from "../../services/HttpClientService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { setUser, setCategories, setMoods, clearFilters } from '../../stores/Slice/searchSlice';
import { Box, Button, Paper, Typography, TextField, Dialog, DialogContent, DialogTitle, Avatar, Divider, IconButton, Tooltip, Snackbar, Alert, styled, Grid, useMediaQuery, useTheme, List, ListItem } from "@mui/material";
import MusicFilter from "../Filter/MusicFilter";
import MoodFilter from "../Filter/MoodFilter";
import CategoryFilter from "../Filter/CategoryFilter";
import userLogo from "../../img/user.png";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import renderArticleText from "../utils/renderArticleText"
import { FormatBold, FormatItalic, CenterFocusStrong, StrikethroughS, FormatColorText, FormatQuote, HighlightAlt, KeyboardTab } from "@mui/icons-material";
import { categories } from "../utils/categoryIcons";

const LogCreateButton = styled(Button)({
    color: '#F5FFFC',
    borderRadius: '50px',
    width: '50px',
    height: '64px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#8ba896",
    filter: 'drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.2))',
    transition: 'background-color 0.3s ease, color 0.3s ease, filter 0.3s ease',
    '&:hover': {
        backgroundColor: '#7A9484',
        color: '#F5FFFC',
        filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))',
    },
});

const WrapTextButton = styled(Button)({
    color: '#4D8A65',
    borderRadius: '50px',
    minWidth: '50px',
    minHeight: '50px',
    width: '50px', // Initial width for icon-only display
    height: '50px',
    padding: '0.5rem',
    textTransform: 'none',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontSize: '0.8rem',
    justifyContent: 'flex-start', // Aligns icon to the left
    paddingLeft: '12px',
    boxShadow: "2px 4px 4px rgba(1, 27, 10, 0.2)",
    borderColor: "transparent",  // Set transparent border
    transition: 'width 0.3s ease, background-color 0.3s ease, color 0.3s ease', // Smoother transition
    '& .button-label': {
        opacity: 0, // Initially hidden label
        transition: 'opacity 0.4s ease', // Fade in/out label transition
        marginLeft: '10px',
    },
    '&:hover .button-label': {
        opacity: 1, // Label appears on hover
    },
});

const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

function LogCreate() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, selectedMusic, selectedMood, selectedCategory } = useSelector((state: RootState) => state.search.data);

    const [title, setTitle] = useState("");
    const [cover, setCover] = useState<string>("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [isURL, setIsURL] = useState<boolean>(true);
    const [article, setArticle] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const [openPreview, setOpenPreview] = useState(false);
    const [keyword, setKeyword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const uid = localStorage.getItem("uid") || "";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result?.toString() || '';
                setCover(base64String);
                setCoverFile(file)
            };

            reader.readAsDataURL(file);
        }
    };

    const handleURLChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCover(e.target.value);
        setIsURL(true);
        setCoverFile(null);
    };

    const prepareCoverAndSubmit = async () => {
        let finalCover = "";

        if (isURL) {
            finalCover = cover;
        } else if (coverFile) {
            finalCover = URL.createObjectURL(coverFile);
        }

        setCover(finalCover);
    };

    useEffect(() => {
        setCover("");
        setCoverFile(null);
    }, [isURL])

    const toThaiYear = (year: number) => year + 543;
    const formatThaiDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = thaiMonths[d.getMonth()];
        const year = toThaiYear(d.getFullYear());
        return `${day} ${month} ${year}`;
    };

    // Function to wrap selected text with the given characters
    const wrapText = (startWrapper: string, endWrapper: string) => {
        const input = textFieldRef.current;
        if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const selectedText = article.slice(start, end);

            let newValue;

            // If the startWrapper is '\t', prepend a tab character to the selected text
            if (startWrapper === '\\t') {
                newValue =
                    article.slice(0, start) +
                    '\\t' + // Prepend tab
                    selectedText +
                    article.slice(end);
            } else {
                // Wrap the selected text with the start and end wrappers
                newValue =
                    article.slice(0, start) +
                    startWrapper +
                    selectedText +
                    endWrapper +
                    article.slice(end);
            }

            setArticle(newValue);

            // Move the caret to the end of the wrapped text
            input.setSelectionRange(end + startWrapper.length + endWrapper.length, end + startWrapper.length + endWrapper.length);
        }
    };

    const handleSubmit = async () => {
        prepareCoverAndSubmit();
        let data = {
            Title: title,
            Cover: cover,
            Article: article,
            UserID: parseInt(uid),
            CategoryID: parseInt(selectedCategory + ""),
            MusicID: parseInt(selectedMusic + ""),
            MoodID: parseInt(selectedMood + ""),
        };

        try {
            setLoading(true)
            const res = await CreateLog(data);
            if (res.status) {
                setSuccess(true);
                setError(false);
                setAlertMessage("Log created successfully!");
                setTitle("");
                setCover("");
                setCoverFile(null);
                setArticle("");
                dispatch(clearFilters());
            } else {
                setSuccess(false);
                setError(true);
                setAlertMessage(res.message || "An error occurred.");
            }
        } catch (error) {
            setSuccess(false);
            setError(true);
            setAlertMessage("An error occurred while creating the log.");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [moodRes, categoryRes, userRes] = await Promise.all([
                    ListMoods(),
                    ListCategories(),
                    GetUser()
                ]);
                if (moodRes) dispatch(setMoods(moodRes));
                if (categoryRes) dispatch(setCategories(categoryRes));
                if (userRes) dispatch(setUser(userRes));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        dispatch(clearFilters());
        fetchAllData();
    }, [dispatch]);

    const handlePreview = () => {
        setOpenPreview(true);
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
    };

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
            <Box sx={{ padding: '2rem', maxWidth: { xs: '800px', lg: '1600px' }, margin: '0 auto' }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: '#384137',
                        fontWeight: 'bold',
                        marginBottom: "1rem"
                    }}
                >
                    New Log
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#fafafa', marginBottom: '2rem', alignItems: "center" }}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                            <Box sx={{ display: "flex", gap: 2, marginBottom: '1rem' }}>
                                {isURL
                                    ? (
                                        <LogCreateButton
                                            onClick={() => setIsURL(!isURL)}
                                        >
                                            <LinkIcon />
                                        </LogCreateButton>
                                    )
                                    : (
                                        <LogCreateButton
                                            onClick={() => setIsURL(!isURL)}
                                        >
                                            <ImageIcon />
                                        </LogCreateButton>

                                    )
                                }

                                {isURL
                                    ? (
                                        <TextField
                                            label="Cover URL"
                                            placeholder="21:9 Image URL"
                                            value={cover}
                                            onChange={handleURLChange}
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
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
                                    )
                                    : (
                                        <LogCreateButton
                                            onClick={handleButtonClick}
                                            sx={{ width: "100%" }}
                                        >
                                            Upload Cover 21:9 {coverFile?.name ? "(" + coverFile.name + ")" : ""}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                hidden
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </LogCreateButton>
                                    )
                                }
                            </Box>
                            <Box>
                                {/* Buttons for adding symbols */}
                                <List
                                    sx={{
                                        mb: { xs: 1, xl: 2 },
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "repeat(4, 1fr)", // Mobile: 4 items per row
                                            sm: "repeat(6, 1fr)", // Small devices: 6 items per row
                                            xl: "repeat(8, 1fr)", // PC/iPad: 8 items per row
                                        },
                                        justifyContent: "center",
                                        gap: 1, // Space between items
                                    }}
                                >
                                    {[
                                        { label: "Tab", icon: <KeyboardTab />, wrapChar: '\\t', width: '86px' },
                                        { label: "Bold", icon: <FormatBold />, wrapChar: '``', width: '92px' },
                                        { label: "Italic", icon: <FormatItalic />, wrapChar: '`', width: '96px' },
                                        { label: "Highlight", icon: <HighlightAlt />, wrapChar: '~', width: '118px' },
                                        { label: "Center", icon: <CenterFocusStrong />, wrapChar: '@', width: '106px' },
                                        { label: "Strikethrough", icon: <StrikethroughS />, wrapChar: '$', width: '148px' },
                                        { label: "Grey Color", icon: <FormatColorText />, wrapChar: '**', width: '100px' },
                                        { label: "Line Break", icon: <FormatQuote />, wrapChar: '""', width: '104px' },
                                    ].map((item, index) => (
                                        <ListItem
                                            key={index}
                                            disablePadding
                                            sx={{
                                                mb: { xs: 1, xl: 0 },
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <WrapTextButton
                                                variant="outlined"
                                                onClick={() => wrapText(item.wrapChar, item.wrapChar)}
                                                sx={{
                                                    transition: "all 0.3s ease", // Smooth transition for all properties
                                                    '&:hover': {
                                                        width: item.width, // Full width on hover
                                                        paddingRight: '14px',
                                                        backgroundColor: '#4D8A65',
                                                        color: '#fafafa',
                                                        boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                                                    },
                                                }}
                                            >
                                                {item.icon}
                                                <span className="button-label">{item.label}</span>
                                            </WrapTextButton>
                                        </ListItem>
                                    ))}
                                </List>

                                {/* TextField for article */}
                                <TextField
                                    label="Article"
                                    variant="outlined"
                                    multiline
                                    rows={6}
                                    fullWidth
                                    value={article}
                                    onChange={(e) => setArticle(e.target.value)}
                                    inputRef={textFieldRef} // Reference to TextField input
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
                            </Box>
                            <MusicFilter keyword={keyword} setKeyword={setKeyword} />
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0, sm: 2 } }}>
                                <MoodFilter />
                                <CategoryFilter />
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "flex-end", marginTop: "2rem" }}>
                                {!isLargeScreen && (
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
                                                width: '50px',
                                                overflow: 'hidden',
                                                padding: '0.5rem',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                color: "#589E74",
                                                borderColor: "#589E74",
                                                transition: 'width 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
                                                '&:hover': {
                                                    width: '130px',
                                                    backgroundColor: '#F5FFFC',
                                                    borderColor: "#4D8A65",
                                                    color: "#4D8A65",
                                                },
                                                '& .button-label': {
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                    marginLeft: '10px',
                                                },
                                                '&:hover .button-label': {
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            <VisibilityIcon sx={{ marginLeft: "4px" }} />
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
                                )}

                                <Tooltip title="Create Log">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        sx={{
                                            marginTop: '1rem',
                                            borderRadius: '50px',
                                            minWidth: '50px',
                                            minHeight: '50px',
                                            width: '50px',
                                            overflow: 'hidden',
                                            padding: '0.5rem',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            backgroundColor: "#457A5A",
                                            transition: 'width 0.3s ease, background-color 0.3s ease',
                                            '&:hover': {
                                                width: '126px',
                                                backgroundColor: '#366147',
                                            },
                                            '& .button-label': {
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                marginLeft: '10px',
                                            },
                                            '&:hover .button-label': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        <AddIcon sx={{ marginLeft: "4px" }} />
                                        <span
                                            className="button-label"
                                            style={{
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            Create
                                        </span>
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Paper>
                    </Grid>
                    {isLargeScreen && (
                        <Grid item xs={12} lg={6}>
                            <Paper elevation={3} sx={{ backgroundColor: '#fafafa', marginBottom: '2rem', alignItems: "center" }}>
                                <Box >
                                    <DialogTitle sx={{ backgroundColor: "#78B591", color: "#fff", fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}>
                                        Preview
                                    </DialogTitle>
                                    <DialogContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                justifyContent: { xs: 'flex-start', md: 'space-between' },
                                                alignItems: { xs: 'flex-start', md: 'center' },
                                                gap: 2,
                                                marginTop: "1.6rem",
                                                padding: { xs: 1, md: 2 }, // Add padding for better spacing
                                                paddingRight: "2rem",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    // maxWidth: '65%'
                                                }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                                        fontWeight: 'bold',
                                                        marginBottom: { xs: '1rem', md: 0 },
                                                        flex: 1, // Make sure the title takes available space
                                                        maxWidth: "100%",
                                                        overflowWrap: 'break-word',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    {title}
                                                </Typography>
                                                {Object.entries(categories)
                                                    .filter(([category, { ID }]) => ID === selectedCategory)  // Filter where ID matches log?.MoodID
                                                    .map(([mood, { ID, Name, Icon }]) => (
                                                        <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Box sx={{ display: "flex", alignItems: 'center', color: "#6C757D", }}>
                                                                {Icon}</Box> {/* Display Icon */}
                                                            < Box sx={{ color: "#6C757D", fontSize: { xs: '0.8rem', md: '1rem' } }}>{Name}</Box> {/* Display Name */}
                                                        </div>
                                                    ))
                                                }
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: { xs: 'flex-start', md: 'center' },
                                                    gap: 2,
                                                    minWidth: "30%"
                                                }}
                                            >
                                                <Avatar
                                                    src={userLogo}
                                                    alt={user.Username || 'User'}
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
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {user.Username || 'Anonymous'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' } }}>
                                                        {formatThaiDate(new Date())}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Divider />
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
                                            {renderArticleText(article)}
                                        </Typography>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '0.5rem' }}>
                                            <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' }, color: '#aaa' }}>
                                                {user.Username} ✧*:･ﾟ
                                            </Typography>
                                            <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' }, marginLeft: '0.4rem', color: '#aaa' }}>
                                                {formatThaiDate(new Date())}
                                            </Typography>
                                        </Box>
                                    </DialogContent>
                                </Box>
                            </Paper>
                        </Grid>)}
                </Grid>

                {/* Preview Modal */}
                <Dialog open={openPreview} onClose={handleClosePreview} fullWidth maxWidth="md">
                    <DialogTitle sx={{ backgroundColor: "#78B591", color: "#fff", fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}>
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
                        <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#fafafa', marginTop: '1rem' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    justifyContent: { xs: 'flex-start', md: 'space-between' },
                                    alignItems: { xs: 'flex-start', md: 'center' },
                                    gap: 2,
                                    padding: { xs: 1, md: 0 },
                                    pb: { xs: 1, md: 2 },
                                    borderBottom: '1px solid #ddd',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // maxWidth: '65%'
                                    }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                                            fontWeight: 'bold',
                                            marginBottom: { xs: '1rem', md: 0 },
                                            flex: 1, // Make sure the title takes available space
                                            maxWidth: "100%",
                                            overflowWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    {Object.entries(categories)
                                        .filter(([category, { ID }]) => ID === selectedCategory)  // Filter where ID matches log?.MoodID
                                        .map(([mood, { ID, Name, Icon }]) => (
                                            <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ display: "flex", alignItems: 'center', color: "#6C757D", }}>
                                                    {Icon}</Box> {/* Display Icon */}
                                                < Box sx={{ color: "#6C757D", fontSize: { xs: '0.8rem', md: '1rem' } }}>{Name}</Box> {/* Display Name */}
                                            </div>
                                        ))
                                    }
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Avatar
                                        src={userLogo}
                                        alt={user.Username || 'User'}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '50%',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {user.Username || 'Anonymous'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' } }}>
                                            {formatThaiDate(new Date())}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Typography
                                paragraph
                                sx={{
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                {renderArticleText(article)}
                            </Typography>
                            <Divider />
                            <Box sx={{ marginTop: '0.5rem' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' }, color: '#aaa' }}>
                                        {user.Username} ✧*:･ﾟ
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' }, marginLeft: '0.4rem', color: '#aaa' }}>
                                        {formatThaiDate(new Date())}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </DialogContent>
                </Dialog>
            </Box>
        </div>
    );
}

export default LogCreate;
