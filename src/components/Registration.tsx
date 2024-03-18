import {IUser, registerUser} from "../services/user-service.ts";
import {useRecoilState} from "recoil";
import {accessTokenState, alertState, refreshTokenState} from "../stateManagement/RecoilState.ts";
import BaseAuthenticationForm from "./BaseAuthenticationForm.tsx";
import {useNavigate} from "react-router-dom";
import {saveUserIDInLocalStorage} from "../services/token-service.ts";
import {useState} from "react";

function Registration() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [alertPopup, setAlertPopup] = useRecoilState(alertState);

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();


    const register = async (email: string, password: string) => {
        if (email && password) {
            const user: IUser = {
                email: email,
                password: password,
            }
            try {
                setLoading(true);
                const res = await registerUser(user)
                setAccessToken(res.accessToken);
                setRefreshToken(res.refreshToken);
                res._id && saveUserIDInLocalStorage(res._id);
                console.log(res)
                setLoading(false)
                setAlertPopup({message: "You are now registered on system :)", variant:"success"});
                navigate("/register/user-details");
            } catch (error) {
                setAlertPopup({message: "Error during registration process...", variant:"danger"});
            }

        }
    }

    return (
        <div className="vstack gap-3 col-md-7 mx-auto">
            <div style={{position:"fixed", zIndex:"1", top: "50%", left: "50%", transform: 'translate(-50%, -50%)'}}>
                {loading && (
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                )}
            </div>
            <h1>Register</h1>
            <BaseAuthenticationForm onSubmitButtonClick={register}/>
        </div>
    );
}

export default Registration;
