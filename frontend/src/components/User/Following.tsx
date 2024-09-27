import { useEffect, useState } from 'react';
import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { GetFollowerByUID, UnfollowUser } from "../../services/HttpClientService";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { setErrorMessage } from '../../stores/Slice/searchSlice';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { FollowerInterface } from "../../interfaces/IFollower";
import Swal from 'sweetalert2';
import "../utils/SweetAlert.css";

function Following() {
    const dispatch = useDispatch<AppDispatch>();
    const { errorMessage } = useSelector((state: RootState) => state.search.data);
    const [following, setFollowing] = useState<FollowerInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const uid = localStorage.getItem("uid") || "";

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            const res = await GetFollowerByUID({ FollowerID: parseInt(uid) });
            if (res) {
                setIsEmpty(false);
                setFollowing(res);
            } else {
                setIsEmpty(true);
                setFollowing([]);
                dispatch(setErrorMessage("No following"));
            }
        } catch (error) {
            console.error("Error fetching following", error);
            dispatch(setErrorMessage("Error fetching following"));
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (follower: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to unfollow "${follower.User.Username}"?`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#E36951',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#4D8A65',
            confirmButtonText: 'Yes, unfollow!',
            customClass: {
                confirmButton: 'confirm-button-class',
                cancelButton: 'cancel-button-class',
            },
        });

        if (result.isConfirmed) {
            let data = {
                UserID: follower.UserID,
                FollowerID: parseInt(uid),
            };

            try {
                await UnfollowUser(data);
                Swal.fire({
                    title: 'Unfollowed!',
                    text: `You have unfollowed "${follower.User.Username}".`,
                    icon: 'success',
                    confirmButtonColor: '#4D8A65',
                    customClass: {
                        confirmButton: 'confirm-button-class',
                    },
                });
                fetchFollowing();
            } catch (error) {
                console.error('Failed to unfollow:', error);
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to unfollow "${follower.User.Username}".`,
                    icon: 'error',
                    confirmButtonColor: '#4D8A65',
                    customClass: {
                        confirmButton: 'confirm-button-class',
                    },
                });
            }
        }
    };

    useEffect(() => {
        fetchFollowing();
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
                        Following
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
                                                <TableCell sx={{ fontWeight: 'bold', color: '#F5FFFC', fontSize: { xs: '0.9rem', md: '1.1rem' } }} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {following.map((following) => (
                                                <TableRow
                                                    key={following.ID}
                                                    sx={{
                                                        '&:nth-of-type(odd)': { backgroundColor: '#F9F9F9' },
                                                        '&:hover': { backgroundColor: '#F1FFF9' }
                                                    }}
                                                >
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {following.User?.Username}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {following.User?.Firstname} {following.User?.Lastname}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {following.User?.Email}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        {following.User?.Province}
                                                    </TableCell>
                                                    <TableCell sx={{ padding: { xs: '0.5rem', md: '0.75rem' }, fontSize: { xs: '0.8rem', md: '1rem' }, color: '#555' }}>
                                                        <Tooltip title="unfollow">
                                                            <IconButton onClick={() => handleFollow(following)}>
                                                                <HeartBrokenIcon />
                                                            </IconButton>
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
        </Box>
    );
}

export default Following;
