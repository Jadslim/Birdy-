import React, { useState } from "react"
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { green, pink } from '@mui/material/colors';
import Box from '@mui/material/Box';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export default function LoginComponent() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    async function loginUser(){
        const res = await fetch(`http://localhost:8000/api/authentification`, {
            method: 'POST',
            // credentials: 'include', // Don't forget to specify this if you need cookies
            body: JSON.stringify({
                "login": login,
                "password": password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await res.json();
        if (data.error){
            console.log(data.error); 
        }
        if (data.accessToken){
            cookies.set('accessToken', data.accessToken, { path: '/' });
            navigate(`/home`)
        } else {
            alert("Wrong creds!")
        }
      }
    const handleRegister = () => {
        navigate('/register')
    }
    return (
        <Container>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{ bgcolor: pink[500] }}>
                    <LoginOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In 
                </Typography>
                <Box component="form" noValidate sx={{mt: 1}}>
                    <TextField onChange={(e) => setLogin(e.target.value)} id="outlined-basic" label="Login" variant="outlined" fullWidth margin="normal"/>
                    <TextField type="password" onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Password" variant="outlined" fullWidth margin="normal"/>
                    {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" /> */}
                    <Button variant="contained" sx={{mt: 2}} fullWidth onClick={loginUser} >Sign In</Button>
                    <Button color="success" variant="contained" sx={{mt: 2}} fullWidth onClick={handleRegister} >Sign Up</Button>
                </Box>

            </Box>

        </Container>
        
    )
}