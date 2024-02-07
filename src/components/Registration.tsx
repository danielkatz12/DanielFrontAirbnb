import {useRef} from 'react';
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
// import {User, registerUser} from "../services/user-service.ts";
import {googleSignin, IUser, registerUser} from "../services/user-service.ts";
import UserProfileDetailsForm from "../UserProfileDetailsForm.tsx";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    currentDisplayedComponentState,
    idTokenState,
    refreshTokenState
} from "../stateManagement/RecoilState.ts";

function Registration() {

    const emailInputRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);


    const register = async () => {
        // const url = await uploadPhoto(imgSrc!);
        // console.log("upload returned:" + url);
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            const user: IUser = {
                email: emailInputRef.current?.value,
                password: passwordInputRef.current?.value,
                // imgUrl: url
            }
            const res = await registerUser(user)
            setAccessToken(res.accessToken);
            setRefreshToken(res.refreshToken);
            console.log(res)
            currDisplayedComp ?? console.log("To delete!!")// todo: to-delete
            setCurrDisplayedComp(<UserProfileDetailsForm isInRegistrationMode={true}/>)
        }
    }

    // const register = async () => {
    //     const url = await uploadPhoto(imgSrc!);
    //     console.log("upload returned:" + url);
    //     if (emailInputRef.current?.value && passwordInputRef.current?.value) {
    //         const user: IUser = {
    //             email: emailInputRef.current?.value,
    //             password: passwordInputRef.current?.value,
    //             imgUrl: url
    //         }
    //         const res = await registerUser(user)
    //         console.log(res)
    //     }
    // }

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        // credentialResponse.credential && saveIdTokenInLocalStorage(credentialResponse.credential);
        console.log(credentialResponse);
        try {
            const res = await googleSignin(credentialResponse)
            console.log("access token: ", accessToken);//TODO: to-delete
            console.log("refresh token: ", refreshToken);//TODO: to-delete
            console.log("id token: ", idToken);//TODO: to-delete
            setAccessToken(res.accessToken);
            setRefreshToken(res.refreshToken);
            setIdToken(credentialResponse.credential);
            // setTokens({accessToken: res.accessToken, refreshToken: res.refreshToken, idToken: credentialResponse.credential})
            console.log("response:", res);
            setCurrDisplayedComp(<UserProfileDetailsForm isInRegistrationMode={true}/>)
        } catch (e) {
            console.log(e)
        }
    }

    const onGoogleLoginFailure = () => {
        console.log("Google login failed")
    }
    return (
        <div className="vstack gap-3 col-md-7 mx-auto">
            <h1>Register</h1>
            <div className="form-floating">
                <input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder=""/>
                <label htmlFor="floatingInput">Email</label>
            </div>
            <div className="form-floating">
                <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword"
                       placeholder=""/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <button type="button" className="btn btn-primary" onClick={register}>Register</button>

            <GoogleLogin text={"continue_with"} onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}/>
        </div>
    )
}

export default Registration;
