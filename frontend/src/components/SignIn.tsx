import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SignInInterface } from "../interfaces/ISignIn";
import { Login } from "../services/HttpClientService";
import '../App.css';
import logo from "../img/book.png";
import BG from "../img/signInBG.jpg";
import { Link, useNavigate } from "react-router-dom";

const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: 'Kanit',
            textTransform: 'none',
            fontSize: 16,
        },
    },
    palette: {
        primary: {
            main: "#6200EE", // modern purple
        },
        secondary: {
            main: "#03DAC5", // teal accent
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: '1rem',
                    borderRadius: '30px',
                    backgroundColor: "#f9f9f9",
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
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#F5FFFC',
                    borderRadius: '50px',
                    width: '100%',
                    height: '48px',
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
                },
            },
        },
    },
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignIn() {
    const [signin, setSignin] = useState<Partial<SignInInterface>>({});
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof signin;
        const { value } = event.target;
        setSignin({ ...signin, [id]: value });
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSuccess(false);
        setError(false);
    };

    const submit = async () => {
        let res = await Login(signin);
        if (res) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/home');
                window.location.reload();
            }, 1000);
        } else {
            setError(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: "100vh", backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", opacity: 0.9 }}>
                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="success">
                        เข้าสู่ระบบสำเร็จ
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={error}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="error">
                        อีเมลหรือรหัสผ่านไม่ถูกต้อง
                    </Alert>
                </Snackbar>
                <CssBaseline />
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: "100vh", px: 2 }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        component={Paper}
                        elevation={6}
                        square
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "30px 40px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 3,
                                gap: 2
                            }}
                        >
                            <img
                                src={logo}
                                alt="Transparent Logo"
                                style={{ height: 100, filter: 'drop-shadow(6px 2px 8px rgba(0, 0, 0, 0.2))' }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#384137', textShadow: '6px 2px 8px rgba(0, 0, 0, 0.2)' }}>
                                Logify
                            </Typography>
                        </Box>

                        <Box sx={{ width: "100%", maxWidth: 400 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="Email"
                                label="Email"
                                name="Email"
                                autoComplete="email"
                                autoFocus
                                value={signin.Email || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="Password"
                                label="Password"
                                name="Password"
                                type="password"
                                autoComplete="current-password"
                                value={signin.Password || ""}
                                onChange={handleInputChange}
                            />
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                <Link to={"/signup"} style={{ textDecoration: "none", width: "100%" }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            backgroundColor: "#E36951",
                                            '&:hover': {
                                                backgroundColor: '#CF604A',
                                            },
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={submit}
                                >
                                    Sign In
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default SignIn;
