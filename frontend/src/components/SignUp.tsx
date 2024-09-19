import React, { useState } from 'react';
import { Box, Button, Paper, Typography, TextField, Tooltip, Snackbar, Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Login, SignUpUser } from "../services/HttpClientService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../stores/store";
import { setSelectedGender, setSelectedProvince } from "../stores/Slice/signupSlice";
import { genders } from "../constants/Signup";
import ProvinceFilter from "./Filter/ProvinceFilter";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function SignUp() {
    const dispatch = useDispatch<AppDispatch>();
    const [Username, setUsername] = useState<string>("");
    const [Firstname, setFirstname] = useState<string>("");
    const [Lastname, setLastname] = useState<string>("");
    const [Email, setEmail] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    const [Telephone, setTelephone] = useState<string>("");
    const [Gender, setGender] = useState<string>("");
    const [Province, setProvince] = useState<string>("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        let data = {
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
        console.log(data)

        try {
            const res = await SignUpUser(data);
            console.log(res)
            if (res.status) {
                setSuccess(true);
                setError(false);
                setAlertMessage("Signup successfully!");
                dispatch(setSelectedGender(0));
                dispatch(setSelectedProvince(0));
            } else {
                setSuccess(false);
                setError(true);
                setAlertMessage(res.message || "An error occurred.");
            }
        } catch (error) {
            setSuccess(false);
            setError(true);
            setAlertMessage("An error occurred while signup.");
        }
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

        const hashedSignInData = {
            Email: Email,
            Password: Password,
        };

        const loginRes = await Login(hashedSignInData);
        if (loginRes.token) {
            navigate('/home');
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
                            onClick={() => navigate(`/`)}
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
                        Sign up
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
                        <Tooltip title="Sign up">
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
                                        width: '114px', // Expands width on hover to the right
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
                                    Sign up
                                </span>
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default SignUp;
