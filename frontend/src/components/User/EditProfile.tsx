import React, { useState } from 'react';
import { Box, Button, Paper, Typography, TextField, Tooltip, Snackbar, Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { UpdateUser } from "../../services/HttpClientService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { setSelectedGender, setSelectedProvince } from "../../stores/Slice/signupSlice";
import { genders } from "../../constants/Signup";
import ProvinceFilter from "../Filter/ProvinceFilter";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function EditProfile() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.search.data);
    const [Username, setUsername] = useState<string>(user.Username + "");
    const [Firstname, setFirstname] = useState<string>(user.Firstname + "");
    const [Lastname, setLastname] = useState<string>(user.Lastname + "");
    const [Email, setEmail] = useState<string>(user.Email + "");
    const [Password, setPassword] = useState<string>("");
    const [Telephone, setTelephone] = useState<string>(user.Telephone + "");
    const [Gender, setGender] = useState<string>(user.Gender + "");
    const [Province, setProvince] = useState<string>(user.Province + "");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [message, setAlertMessage] = useState("");
    const navigate = useNavigate();
    const uid = localStorage.getItem('uid')

    const handleSubmit = async () => {
        let data = {
            ID: parseInt(uid || ""),
            Username: Username,
            Firstname: Firstname,
            Lastname: Lastname,
            Email: Email,
            Password: Password,
            Telephone: Telephone,
            Role: "User",
            Gender: Gender || "",
            Province: Province || "",
        };

        try {
            const res = await UpdateUser(data);
            if (res.status) {
                setSuccess(true);
                setError(false);
                setAlertMessage("Update profile successfully!");
                dispatch(setSelectedGender(0));
                dispatch(setSelectedProvince(0));
                setShouldNavigate(true);  // ตั้งค่าสถานะเพื่ออนุญาตการนำทาง
            } else {
                setSuccess(false);
                setError(true);
                setAlertMessage(res.message || "An error occurred.");
            }
        } catch (error) {
            setSuccess(false);
            setError(true);
            setAlertMessage("An error occurred while update profile.");
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClose = async (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);

        // ตรวจสอบว่าสามารถนำทางได้หรือไม่
        if (shouldNavigate) {
            setShouldNavigate(false);  // รีเซ็ตสถานะการนำทาง
            navigate('/profile');  // นำทางไปยังหน้า User
            window.location.reload();
        }
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
                            onClick={() => navigate(`/profile`)}
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
                        Edit Profile
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#fafafa', marginBottom: '2rem', alignItems: "center" }}>
                    <TextField
                        label="username"
                        variant="outlined"
                        fullWidth
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        label="email"
                        variant="outlined"
                        disabled
                        fullWidth
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        label="password"
                        variant="outlined"
                        fullWidth
                        value={Password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 0, md: 2 } }}>
                        <TextField
                            label="first name"
                            variant="outlined"
                            fullWidth
                            value={Firstname}
                            onChange={(e) => setFirstname(e.target.value)}
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
                            label="last name"
                            variant="outlined"
                            fullWidth
                            value={Lastname}
                            onChange={(e) => setLastname(e.target.value)}
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
                    <TextField
                        label="telephone"
                        variant="outlined"
                        fullWidth
                        value={Telephone}
                        onChange={(e) => setTelephone(e.target.value)}
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
                    <FormControl component="fieldset" sx={{ margin: '1rem 0' }}>
                        <FormLabel component="legend" sx={{
                            color: '#384137', fontSize: '1rem',
                            '&.Mui-focused': {
                                color: '#78B591', // Color when focused
                            },
                        }}>Gender</FormLabel>
                        <RadioGroup
                            value={Gender}
                            onChange={event => setGender((event.target as HTMLInputElement).value)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between', // Adjust spacing between radio buttons
                                '& .MuiFormControlLabel-root': {
                                    marginRight: '1rem', // Adjust space between radio options
                                },
                                '& .MuiRadio-root': {
                                    color: '#384137', // Color of the radio buttons
                                    '&.Mui-checked': {
                                        color: '#78B591', // Color when checked
                                    },
                                },
                                '& .MuiFormLabel-root': {
                                    marginBottom: '0.5rem', // Space below label
                                },
                            }}
                        >
                            {genders.map((genderOption) => (
                                <FormControlLabel
                                    key={genderOption}
                                    value={genderOption}
                                    control={<Radio />}
                                    label={genderOption}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '0.875rem', // Adjust font size
                                            color: '#384137', // Color of the labels
                                        },
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <ProvinceFilter Province={Province} setProvince={setProvince} />
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "flex-end", marginTop: "2rem" }}>
                        <Tooltip title="Edit Profile">
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
                                        width: '98px', // Expands width on hover to the right
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
                                    }}
                                >
                                    Edit
                                </span>
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default EditProfile;
