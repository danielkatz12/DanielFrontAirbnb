import React from 'react';
import BaseAuthenticationForm from "./BaseAuthenticationForm.tsx";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    currentDisplayedComponentState,
    refreshTokenState,
    UserDetailsData, userDetailsState
} from "../stateManagement/RecoilState.ts";
import {IUser, loginUser} from "../services/user-service.ts";
import PostsList from "./PostsList.tsx";
import {getUserIDFromLocalStorage, saveUserIDInLocalStorage} from "../services/token-service.ts";
import {getAllUserProfileDetails, getMyUserProfileDetails} from "../services/user-profile-details-service.ts";
import {redirect, useNavigate} from "react-router-dom";

function UserLogin() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);

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
                res._id! && saveUserIDInLocalStorage(res._id);
                console.log("response:", res);

                try {
                    const userDetails: UserDetailsData = await getMyUserProfileDetails(getUserIDFromLocalStorage()!)
                    setUserProfileDetails(userDetails)
                } catch (error) {
                    console.log("failed to gey the uder details from server")
                }
                //TODO: maybe alert the success?

                setCurrDisplayedComp(<PostsList/>)
                navigate("/")
            } catch (error) {
                //TODO: maybe alert the error?
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
