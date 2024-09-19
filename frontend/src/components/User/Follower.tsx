import { useEffect, useState } from 'react';
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { GetFollowerByUID } from "../../services/HttpClientService";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { setErrorMessage } from '../../stores/Slice/searchSlice';
import { FollowerInterface } from "../../interfaces/IFollower";

function Follower() {
    const dispatch = useDispatch<AppDispatch>();
    const { errorMessage } = useSelector((state: RootState) => state.search.data);
    const [followers, setFollowers] = useState<FollowerInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const uid = localStorage.getItem("uid") || "";

    const fetchFollowers = async () => {
        try {
            setLoading(true);
            const res = await GetFollowerByUID({ UserID: parseInt(uid) });
            if (res) {
                setIsEmpty(false);
                setFollowers(res);
            } else {
                setIsEmpty(true);
                setFollowers([]);
                dispatch(setErrorMessage("No followers"));
            }
        } catch (error) {
            console.error("Error fetching followers", error);
            dispatch(setErrorMessage("Error fetching followers"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowers();
    }, [uid]);

    return (
        <Box sx={{ margin: '2rem 10% 4rem 10%' }}>
            {!isEmpty && (
                <Box sx={{ alignItems: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#384137',
                            fontWeight: 'bold',
                        }}
                    >
                        Follower
                    </Typography>
                </Box>
            )}
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
                                    <ErrorOutlineIcon sx={{ fontSize: { xs: 30, md: 40 }, filter: 'drop-shadow(6px 2px 8px rgba(0, 0, 0, 0.2))' }} />
                                    <Typography sx={{ marginTop: "-8px", fontSize: { xs: "30px", md: "40px" }, textShadow: '6px 2px 8px rgba(0, 0, 0, 0.2)' }}>
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
                                        width: "100%",
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#4D8A65' }}>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#F5FFFC', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                                                    Username
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#F5FFFC', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                                                    Name
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#F5FFFC', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                                                    Email
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: '#F5FFFC', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                                                    Province
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {followers.map((follower) => (
                                                <TableRow
                                                    key={follower.ID}
                                                    sx={{
                                                        '&:nth-of-type(odd)': { backgroundColor: '#F9F9F9' },
                                                        '&:hover': { backgroundColor: '#F1FFF9' }
                                                    }}
                                                >
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {follower.Follower?.Username}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {follower.Follower?.Firstname} {follower.Follower?.Lastname}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {follower.Follower?.Email}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {follower.Follower?.Province}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                    </>
                )}
        </Box>
    );
}

export default Follower;
