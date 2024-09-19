import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Link, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, styled } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import logo from "../../img/book.png"
import userLogo from "../../img/user.png"

import "../../App.css";
import "../../index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { GetUser } from "../../services/HttpClientService";
import { useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { setUser } from "../../stores/Slice/searchSlice";

const StyledLink = styled(Link)({
    color: "#384137",
    textDecoration: 'none',
});

const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: "Kanit",
            textTransform: "none",
            fontSize: 18,
        },
    },
    // Define responsive heights for different breakpoints
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    height: '80px', // Default height
                },
            },
        },
    },
});

const NavbarButton = styled(Button)({
    color: '#4D8A65',
    borderRadius: '50px',
    minWidth: '50px',
    minHeight: '50px',
    width: '50px', // Initial width for icon-only display
    padding: '0.5rem',
    textTransform: 'none',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'flex-start', // Aligns icon to the left
    alignItems: 'center',
    paddingLeft: '13px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: "2px 4px 4px rgba(1, 27, 10, 0.2), -2px -4px 4px rgba(255, 255, 255, 0.3)",
    transition: 'width 0.3s ease, background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease', // Smoother transition
    '& .button-label': {
        opacity: 0, // Initially hidden label
        transition: 'opacity 0.4s ease', // Fade in/out label transition
        marginLeft: '10px',
    },
    '&:hover .button-label': {
        opacity: 1, // Label appears on hover
    },
});

function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.search.data);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const open = Boolean(anchorEl);
    const UFirstName = localStorage.getItem("firstname") + "";
    const ULastName = localStorage.getItem("lastname") + "";
    const UserName = UFirstName + " " + ULastName;
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // let mgMD = 0.5

    const mgMD = useMemo(() => {
        return isMobile ? 0.5 : 3;
    }, [isMobile]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const signout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const fetchUserByID = async () => {
        let res = await GetUser();
        res && dispatch(setUser(res));
    };

    useEffect(() => {
        fetchUserByID()
    }, [])

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const sidebarContent = (
        <Box
            sx={{
                width: 250,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List
                sx={{
                    flex: 1,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Link to="/home" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem sx={{
                        color: '#F5FFFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "#457A5A",
                        borderRadius: "0 0 20px 20px",
                        marginBottom: "1rem",
                        padding: 2,
                        filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.3))'
                    }}>
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img
                                    src={logo}
                                    alt="Transparent Logo"
                                    style={{ height: 40, marginRight: 10, filter: 'drop-shadow(6px 2px 8px rgba(0, 0, 0, 0.2))' }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F5FFFC', textShadow: '6px 2px 8px rgba(0, 0, 0, 0.2)' }}>
                                    Logify
                                </Typography>
                            </Box>
                        </ListItemIcon>
                    </ListItem>
                </Link>
                <Link to="/log/create" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li">
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreateIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create" />
                    </ListItem>
                </Link>
                {/* Repeat for other ListItem components */}
                <Link to="/log/my" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li" >
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SpeakerNotesIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Log" />
                    </ListItem>
                </Link>
                <Link to="/music" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li" >
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AudiotrackIcon />
                        </ListItemIcon>
                        <ListItemText primary="Music" />
                    </ListItem>
                </Link>
                <Link to="/log/liked" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li" >
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ThumbUpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Liked" />
                    </ListItem>
                </Link>
                <Link to="/log/saved" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li" >
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Saved" />
                    </ListItem>
                </Link>
                <Link to="/follower" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li" >
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FavoriteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Follower" />
                    </ListItem>
                </Link>
                <Link to="/following" style={{ textDecoration: 'none', color: '#384137' }}>
                    <ListItem component="li" >
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <VolunteerActivismIcon />
                        </ListItemIcon>
                        <ListItemText primary="Following" />
                    </ListItem>
                </Link>
            </List>
            <List>
                <ListItem component="li" sx={{ color: '#F5FFFC', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: "#457A5A", borderRadius: "20px 20px 0 0", margin: "0 auto -8px 0", filter: 'drop-shadow(0px -6px 8px rgba(0, 0, 0, 0.3))' }}>
                    <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LogoutRoundedIcon sx={{ color: "#F5FFFC" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Fragment>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" sx={{ bgcolor: "#B5CEBF", color: "#000000", padding: `0 ${mgMD}rem` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 1.5, }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {/* Show MenuIcon and Sidebar for Mobile */}
                                {isMobile && (
                                    <IconButton onClick={toggleDrawer(true)} sx={{ mr: 2, p: 0, pl: 1.5 }}>
                                        <MenuIcon />
                                    </IconButton>
                                )}

                                {/* Logo Section, always aligned to the left */}
                                <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={logo}
                                        alt="Transparent Logo"
                                        style={{ height: 40, marginRight: 10, filter: 'drop-shadow(6px 2px 8px rgba(0, 0, 0, 0.2))' }}
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#384137', textShadow: '6px 2px 8px rgba(0, 0, 0, 0.2)' }}>
                                        Logify
                                    </Typography>
                                </Link>
                                {/* Navbar Links */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '16px',
                                        paddingLeft: '72px',
                                        alignItems: 'center',
                                    }}
                                >
                                    {!isMobile && (
                                        <>
                                            <StyledLink to="/log/create">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '124px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                    },
                                                }}>
                                                    <CreateIcon />
                                                    <span className="button-label">Create</span>
                                                </NavbarButton>
                                            </StyledLink>
                                            <StyledLink to="/log/my">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '120px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                    },
                                                }}>
                                                    <SpeakerNotesIcon />
                                                    <span className="button-label">MyLog</span>
                                                </NavbarButton>
                                            </StyledLink>
                                            <StyledLink to="/music">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '116px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                        boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                                                    },
                                                }}>
                                                    <AudiotrackIcon />
                                                    <span className="button-label">Music</span>
                                                </NavbarButton>
                                            </StyledLink>
                                            <StyledLink to="/log/liked">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '110px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                        boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                                                    },
                                                }}>
                                                    <ThumbUpIcon />
                                                    <span className="button-label">Liked</span>
                                                </NavbarButton>
                                            </StyledLink>
                                            <StyledLink to="/log/saved">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '118px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                        boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                                                    },
                                                }}>
                                                    <BookmarkIcon />
                                                    <span className="button-label">Saved</span>
                                                </NavbarButton>
                                            </StyledLink>
                                            <StyledLink to="/follower">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '134px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                        boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                                                    },
                                                }}>
                                                    <FavoriteIcon />
                                                    <span className="button-label">Follower</span>
                                                </NavbarButton>
                                            </StyledLink>
                                            <StyledLink to="/following">
                                                <NavbarButton sx={{
                                                    '&:hover': {
                                                        width: '142px', // Expands on hover
                                                        paddingRight: '14px', // Adds space for the text on hover
                                                        backgroundColor: '#4D8A65',
                                                        color: '#F5FFFC',
                                                        boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                                                    },
                                                }}>
                                                    <VolunteerActivismIcon />
                                                    <span className="button-label">Following</span>
                                                </NavbarButton>
                                            </StyledLink>
                                        </>
                                    )}
                                </Box>
                            </Box>

                            {/* User Section */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Tooltip title="Account settings">
                                    <IconButton onClick={handleClick}>
                                        <img
                                            src={userLogo}
                                            alt="User logo"
                                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </AppBar>

                    {/* Sidebar for Mobile */}
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                        {sidebarContent}
                    </Drawer>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                mt: 1.5,
                                '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {/* Menu items for user account */}
                        <StyledLink to="/profile">
                            <MenuItem sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                backgroundColor: "#457A5A",
                                color: "#F5FFFC",
                                marginTop: "-8px",
                                borderRadius: "0 0 20px 20px",
                                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.3)",
                                transition: "background-color 0.3s ease",
                                '&:hover': {
                                    backgroundColor: '#3A664B',
                                    color: '#F5FFFC',
                                },

                            }}>
                                {user.Username}
                            </MenuItem>
                            <MenuItem sx={{ fontSize: "1rem", paddingTop: "16px" }}>{UserName}</MenuItem>
                        </StyledLink>

                        <Divider />
                        <StyledLink to="/log/my" >
                            <MenuItem sx={{ fontSize: "1rem" }}>My log</MenuItem>
                        </StyledLink>
                        <MenuItem onClick={signout} sx={{
                            fontSize: "1rem",
                            backgroundColor: "#457A5A",
                            color: "#F5FFFC",
                            marginBottom: "-8px",
                            transition: "background-color 0.3s ease",
                            '&:hover': {
                                backgroundColor: '#3A664B',
                                color: '#F5FFFC',
                            },
                        }}>
                            <LogoutRoundedIcon fontSize="small" />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>

                <Outlet />
            </Fragment>
        </ThemeProvider>
    );
}

export default Navbar;
