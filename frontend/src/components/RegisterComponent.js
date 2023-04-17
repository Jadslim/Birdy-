import React, { useState } from "react"
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { blue, green, pink } from '@mui/material/colors';
import Box from '@mui/material/Box';
import AppRegistrationOutlined from '@mui/icons-material/AppRegistrationOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";


export default function RegisterComponent() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();
    // const validateLogin = (login) => {
    //     return email.match(
    //       /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //     );
    //   };
    const handleLogin = () => {
        navigate("/login")
    }
    async function signupUser(){ 
        if (password !== confirmPassword){
            alert("Password and Confirm Password are different!"); 
        } else if (password.length < 8){
            alert("Minimum password size is 8!");
        } 
        else {
            const res = await fetch('http://localhost:8000/api/users/user', {
                method: 'PUT',
                // credentials: 'include', // Don't forget to specify this if you need cookies
                body: JSON.stringify({
                    "firstname": firstName,
                    "lastname": lastName,
                    "login": login,
                    "password": password,
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.errors){
                alert("Account with this login already exist!"); 
            } else {
                alert("Your account has been successfully registered!")
                navigate(`/login`);
            }

        }           
      }
    
    return (
        <Container>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{ bgcolor: green[600] }}>
                    <AppRegistrationOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up 
                </Typography>
                <Box component="form" noValidate sx={{mt: 1}}>
                    <TextField onChange={(e) => setFirstName(e.target.value)} id="outlined-basic" label="First Name" variant="outlined" fullWidth margin="normal"/>
                    <TextField onChange={(e) => setLastName(e.target.value)} id="outlined-basic" label="Last Name" variant="outlined" fullWidth margin="normal"/>
                    <TextField type="login" onChange={(e) => setLogin(e.target.value)} id="outlined-basic" label="Login" variant="outlined" fullWidth margin="normal"/>
                    <TextField type="password" onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Password" variant="outlined" fullWidth margin="normal"/>
                    <TextField type="password" onChange={(e) => setConfirmPassword(e.target.value)} id="outlined-basic" label="Confirm Password" variant="outlined" fullWidth margin="normal"/>
                    
                    {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" /> */}
                    <Button color="success" variant="contained" sx={{mt: 2}} fullWidth onClick={signupUser} >Sign Up</Button>
                    <Button variant="contained" sx={{mt: 2}} fullWidth onClick={handleLogin} >Sign In</Button>
                </Box>

            </Box>

        </Container>
        
    )
}