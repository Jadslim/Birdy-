import { Route, Navigate, redirect } from "react-router-dom";
import React, {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";
import { checkUser } from "../common/auth";

export default function PrivateRoute({role, children}) {    

    return(
        <>
            {
                checkUser() === false
                ?
                    <Navigate to="/login" replace />
                :
                children
                
                
            }
        </>
    )
};