import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    alertState,
    idTokenState,
    refreshTokenState,
    userDetailsState
} from "./stateManagement/RecoilState.ts";
import {
    getAccessTokenFromLocalStorage,
    getUserIDFromLocalStorage,
    saveAccessTokenInLocalStorage,
    saveIdTokenInLocalStorage,
    saveRefreshTokenInLocalStorage
} from "./services/token-service.ts";
import PostsList from "./components/PostsList.tsx";
import {getMyUserProfileDetails} from "./services/user-profile-details-service.ts";
import {Route, Routes} from "react-router-dom";
import Registration from "./components/Registration.tsx";
import UserLogin from "./components/UserLogin.tsx";
import MyProfile from "./components/MyProfile.tsx";
import PostForm from "./components/PostForm.tsx";
import NavBar from "./components/NavBar.tsx";
import UserProfileDetailsForm from "./components/UserProfileDetailsForm.tsx";
import AlertMessage from "./components/AlertMessage.tsx";


function App() {
    // const [connectedUserDetails, setConnectedUserDetails] = useState<RegistrationDetails>();//todo: to delete
    //const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);//todo: to delete
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);
    const [alertPopup, setAlertPopup] = useRecoilState(alertState);


    useEffect(() => {
        console.log("useEffect saveAccessTokenInLocalStorage")
        accessToken && saveAccessTokenInLocalStorage(accessToken);
    }, [accessToken]);

    useEffect(() => {
        console.log("useEffect saveRefreshTokenInLocalStorage")
        refreshToken && saveRefreshTokenInLocalStorage(refreshToken);
    }, [refreshToken]);

    useEffect(() => {
        idToken && saveIdTokenInLocalStorage(idToken);
    }, [idToken]);
    useEffect(() => {
        getAccessTokenFromLocalStorage() && getUserIDFromLocalStorage() &&
        getMyUserProfileDetails(getUserIDFromLocalStorage()!)
            .then((value) => setUserProfileDetails(value))
            .catch((error) => {
                console.log("failed to get the user details from server. error: ", error);
                setAlertPopup({message:"Failed in fetching user details from server", variant:"danger"})
            })
    }, []);

    // useEffect(() => {
    //     setCurrDisplayedComp(<PostsList/>)
    // }, []);//todo: to delete


    return (
        <div>
            <NavBar/>
            <Routes>
                <Route path={"/"} element={<PostsList/>}/>
                <Route path={"/register"} element={<Registration/>}/>
                <Route path={"/login"} element={<UserLogin/>}/>
                {getAccessTokenFromLocalStorage() && <Route path={"/register/user-details"}
                                                            element={<UserProfileDetailsForm
                                                                isInRegistrationMode={true}/>}/>}
                {getAccessTokenFromLocalStorage() &&
                    <Route path={"/my-profile"} element={<MyProfile userProfileDetails={userProfileDetails}/>}/>}
                {getAccessTokenFromLocalStorage() &&
                    <Route path={"/user-details"} element={<UserProfileDetailsForm isInRegistrationMode={false}/>}/>}
                {getAccessTokenFromLocalStorage() && <Route path={"/add-post"} element={<PostForm/>}/>}
                {getAccessTokenFromLocalStorage() &&
                    <Route path={"/my-posts"} element={<PostsList filterByUserId={getUserIDFromLocalStorage()!}/>}/>}
            </Routes>

            <AlertMessage/>
        </div>
    );
}

export default App
