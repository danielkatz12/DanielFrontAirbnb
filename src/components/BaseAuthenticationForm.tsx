import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import z from "zod";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {googleSignin} from "../services/user-service.ts";
import {getUserIDFromLocalStorage, saveUserIDInLocalStorage} from "../services/token-service.ts";
import {getAllUserProfileDetails, getMyUserProfileDetails} from "../services/user-profile-details-service.ts";
import {
    accessTokenState, currentDisplayedComponentState, idTokenState,
    refreshTokenState,
    UserDetailsData,
    userDetailsState
} from "../stateManagement/RecoilState.ts";
import PostsList from "./PostsList.tsx";
import UserProfileDetailsForm from "./UserProfileDetailsForm.tsx";
import {useRef} from "react";
import {useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";

const schema = z.object({
    email: z.string().optional(),
    password: z.string().min(6, "Password must be longer then 6 charecters").max(20, "Password must be less then 20 charecters").optional()
})
type FormData = z.infer<typeof schema>
interface BaseAuthProps{
    onSubmitButtonClick: (emailInput: string, passwordInput: string) => void,
    //onCancelButtonClick: () => void,
}
function BaseAuthenticationForm(props: BaseAuthProps) {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({resolver: zodResolver(schema)})

    const emailInputRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);

    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        console.log("in Base Auth Submit")
        console.log("data: ", data)
        if(emailInputRef.current?.value && passwordInputRef.current?.value)
        props.onSubmitButtonClick(emailInputRef.current.value, passwordInputRef.current.value);
    }

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse);
        try {
            const res = await googleSignin(credentialResponse)
            console.log("access token: ", accessToken);//TODO: to-delete
            console.log("refresh token: ", refreshToken);//TODO: to-delete
            console.log("id token: ", idToken);//TODO: to-delete
            setAccessToken(res.accessToken);
            setRefreshToken(res.refreshToken);
            setIdToken(credentialResponse.credential);
            res._id! && saveUserIDInLocalStorage(res._id);
            console.log("response:", res);
            //check if user already signin with google account before
            const allUserProfileDetails = await getAllUserProfileDetails();
            const isUserAlreadyExists = allUserProfileDetails.some(value => value.user === res._id);
            try {
                const userDetails: UserDetailsData = await getMyUserProfileDetails(getUserIDFromLocalStorage()!)
                setUserProfileDetails(userDetails)
            } catch (error) {
                console.log("failed to gey the uder details from server")
            }
            isUserAlreadyExists ? navigate("..") : navigate("/register/user-details")
            setCurrDisplayedComp(isUserAlreadyExists ? <PostsList/> :
                <UserProfileDetailsForm isInRegistrationMode={true}/>)//todo: to delete
        } catch (e) {
            console.log(e)
        }
    }

    const onGoogleLoginFailure = () => {
        console.log("Google login failed")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="vstack gap-3">
                <div className="form-floating">
                    {/*<input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder=""/>*/}
                    <input {...register("email")} ref={emailInputRef} type="email" id="email" className="form-control"/>
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating">
                    {/*<input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword"*/}
                    {/*       placeholder=""/>*/}
                    <input {...register("password")} ref={passwordInputRef} type="password" id="email" className="form-control"/>
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                {/*<button type="button" className="btn btn-primary" onClick={register}>My Name</button>*/}
                <button type="submit" className="btn btn-primary">Submit</button>

                <GoogleLogin text={"continue_with"} onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}/>
            </div>
        </form>
    );
}

export default BaseAuthenticationForm;
