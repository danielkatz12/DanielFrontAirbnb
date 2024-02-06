import {ChangeEvent, useRef, useState} from 'react';
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import avatar from '../assets/avatar.jpeg'
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {uploadPhoto} from "../services/file-service.ts";
// import {User, registerUser} from "../services/user-service.ts";
import {googleSignin, IUser, registrUser} from "../services/user-service.ts";
import UserProfileDetailsForm from "../UserProfileDetailsForm.tsx";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    currentDisplayedComponentState,
    idTokenState,
    refreshTokenState
} from "../stateManagement/RecoilState.ts";

function Registration() {
    const [imgSrc, setImgSrc] = useState<File>()

    const fileInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);
    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }
    const selectImg = () => {
        console.log("Selecting image...")
        fileInputRef.current?.click()
    }

    const register = async () => {
        const url = await uploadPhoto(imgSrc!);
        console.log("upload returned:" + url);
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            const user: IUser = {
                email: emailInputRef.current?.value,
                password: passwordInputRef.current?.value,
                imgUrl: url
            }
            const res = await registrUser(user)
            setAccessToken(res.accessToken);
            setRefreshToken(res.refreshToken);
            console.log(res)
            currDisplayedComp ?? console.log("To delete!!")// todo: to-delete
            setCurrDisplayedComp(<UserProfileDetailsForm username={res.email} password={"1234"}/>)
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
            setCurrDisplayedComp(<UserProfileDetailsForm username={res.email} password={"1234"}/>)
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
            <div className="d-flex justify-content-center position-relative">
                <img src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} style={{height: "230px", width: "230px"}}
                     className="img-fluid"/>
                <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                    <FontAwesomeIcon icon={faImage} className="fa-xl"/>
                </button>
            </div>

            <input style={{display: "none"}} ref={fileInputRef} type="file" onChange={imgSelected}></input>

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

            <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}/>
        </div>
    )
}

export default Registration;
