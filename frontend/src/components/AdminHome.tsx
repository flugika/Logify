import { Button, Box } from "@mui/material";
import '../App.css';

function AdminHome() {

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Admin Home</h1>
        <Button variant="contained" onClick={signout}>Sign Out</Button>
    </div>
  );
}

export default AdminHome;
