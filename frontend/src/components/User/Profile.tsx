import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/store';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Layout from '../Layout';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LogInterface } from "../../interfaces/ILog";
import { GetMostLikeLog, GetMostSaveLog } from "../../services/HttpClientService";
import LogCard from "../Log/LogCard";

function Profile() {
    const { user } = useSelector((state: RootState) => state.search.data);
    const [MostLikeLog, setMostLikeLog] = useState<LogInterface>({});
    const [MostSaveLog, setMostSaveLog] = useState<LogInterface>({});

    const fetchData = async () => {
        try {
            const [likeRes, saveRes] = await Promise.all([
                GetMostLikeLog(),
                GetMostSaveLog(),
            ]);
            if (likeRes) setMostLikeLog(likeRes);
            if (saveRes) setMostSaveLog(saveRes);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Layout>
            <Box sx={{ padding: {xs:'2rem 0.6rem 2rem 0.6rem', md: "2rem"}, maxWidth: '1200px', margin: '0 auto' }}>
                {user ? (
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={8}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'visible' }}>
                                <CardHeader
                                    title={user.Username}
                                    subheader={`${user.Firstname} ${user.Lastname}`}
                                    sx={{
                                        pl: "2rem",
                                        borderRadius: '12px 12px 0 0',
                                        backgroundColor: '#93DEB2',
                                        borderBottom: '1px solid #E0E0E0',
                                        '& .MuiCardHeader-title': {
                                            color: '#384137', // Customize title color
                                            fontSize: '3rem', // Customize title font size
                                            fontWeight: 'bold', // Customize title font weight
                                        },
                                        '& .MuiCardHeader-subheader': {
                                            color: '#6D6D6D', // Customize subheader color
                                            fontSize: '1.5rem', // Customize subheader font size
                                            fontWeight: 'normal', // Customize subheader font weight
                                        }
                                    }}
                                />
                                <CardContent>
                                    <Box sx={{ pl: "1.2rem", }}>
                                        <Typography variant="body1" gutterBottom sx={{ color: "#384137" }}>{user.Email}</Typography>
                                        <Typography variant="body2" color="textSecondary">Province: {user.Province}</Typography>
                                        <Typography variant="body2" color="textSecondary">Gender: {user.Gender}</Typography>
                                        <Typography variant="body2" color="textSecondary">Tel: {user.Telephone}</Typography>
                                    </Box>
                                    <Divider sx={{ m: "1rem 0" }} />
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mt: "1rem", pl: "1.2rem", }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <FavoriteIcon />
                                            Followers: {user.FollowerCount}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <VolunteerActivismIcon />
                                            Following: {user.FollowingCount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: { xs: 2, lg: 0 }, mt: "2rem", justifyContent: "center" }}>
                                        {MostLikeLog &&
                                            <Box >
                                                <Typography variant="body1" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#384137", mb: "-24px" }}>Most Likes</Typography>
                                                <Grid container spacing={2} justifyContent="center">
                                                    <Grid
                                                        item
                                                        xs="auto"
                                                        sm="auto"
                                                        md="auto"
                                                        lg="auto"
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            flexBasis: 'auto',
                                                            maxWidth: '345px',
                                                        }}
                                                    >
                                                        <Link to={`/log/${MostLikeLog.ID}`} style={{ textDecoration: "none" }}>
                                                            <LogCard log={MostLikeLog} />
                                                        </Link>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        }
                                        {MostSaveLog &&
                                            <Box>
                                                <Typography variant="body1" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#384137", mb: "-24px" }}>Most Saves</Typography>
                                                <Grid container spacing={2} justifyContent="center">
                                                    <Grid
                                                        item
                                                        xs="auto"
                                                        sm="auto"
                                                        md="auto"
                                                        lg="auto"
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            flexBasis: 'auto',
                                                            maxWidth: '345px',
                                                        }}
                                                    >
                                                        <Link to={`/log/${MostSaveLog.ID}`} style={{ textDecoration: "none" }}>
                                                            <LogCard log={MostSaveLog} />
                                                        </Link>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        }
                                    </Box>
                                    <Link to="/profile/edit" style={{ textDecoration: 'none', display: "flex", justifyContent: "flex-end" }}>
                                        <Tooltip title="Edit Profile">
                                            <Button
                                                variant="contained"
                                                color="primary"
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
                                                        width: '98px',
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
                                                <EditIcon sx={{ marginLeft: "4px" }} />
                                                <span
                                                    className="button-label"
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Edit
                                                </span>
                                            </Button>
                                        </Tooltip>
                                    </Link>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
                        <ErrorOutlineIcon sx={{ fontSize: '4rem', color: 'error.main' }} />
                        <Typography variant="h6">No user data available</Typography>
                    </Box>
                )}
            </Box>
        </Layout>
    );
}

export default Profile;
