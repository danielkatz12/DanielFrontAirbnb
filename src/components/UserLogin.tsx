import React from 'react';
import BaseAuthenticationForm from "./BaseAuthenticationForm.tsx";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    alertState,
    refreshTokenState,
    UserDetailsData,
    userDetailsState
} from "../stateManagement/RecoilState.ts";
import {IUser, loginUser} from "../services/user-service.ts";
import {
    clearAllFromLocalStorage,
    getUserIDFromLocalStorage,
    saveUserIDInLocalStorage
} from "../services/token-service.ts";
import {getMyUserProfileDetails} from "../services/user-profile-details-service.ts";
import {useNavigate} from "react-router-dom";

function UserLogin() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);
    const [alertPopup, setAlertPopup] = useRecoilState(alertState);

    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        if (email && password) {
            const user: IUser = {
                email: email,
                password: password,
            }
            try {
                const res = await loginUser(user)
                setAccessToken(res.accessToken);
                setRefreshToken(res.refreshToken);

                console.log(res)
                res._id && saveUserIDInLocalStorage(res._id);
                console.log("response:", res);

                try {
                    const userDetails: UserDetailsData = await getMyUserProfileDetails(getUserIDFromLocalStorage()!)
                    setUserProfileDetails(userDetails)
                    setAlertPopup({message: "Login successfully :)" , variant:"success"});
                    navigate("/")
                } catch (error) {
                    console.log("failed to get the user details from server")
                    setAlertPopup({message: "Error in login process..." , variant:"danger"});
                    clearAllFromLocalStorage();
                    navigate("/")
                }

            } catch (error) {
                if (error instanceof Error && error.message === "401") {
                    setAlertPopup({message: "Incorrect Email or Password..." , variant:"danger"});
                } else {
                    setAlertPopup({message: "Error in login process..." , variant:"danger"});
                }
            }
        }
    }

    return (
        <div className="vstack gap-3 col-md-7 mx-auto">
            <h1>Login</h1>
            <BaseAuthenticationForm onSubmitButtonClick={login}/>
        </div>
    );
}

export default UserLogin;
//todo: to save user id in local storage when login
