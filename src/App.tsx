import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    currentDisplayedComponentState,
    idTokenState,
    refreshTokenState,
    userDetailsState
} from "./stateManagement/RecoilState.ts";
import {
    clearAllFromLocalStorage,
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
import PostDisplay from "./components/PostDisplay.tsx";
import UserProfileDetailsForm from "./components/UserProfileDetailsForm.tsx";


function App() {
    // const [connectedUserDetails, setConnectedUserDetails] = useState<RegistrationDetails>();
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);


    // const logout = () => {
    //     clearAllFromLocalStorage();
    //     setAccessToken(undefined);
    //     setRefreshToken(undefined);
    //     setIdToken(undefined);
    //     alert("user is now Logout")
    // }

    //TODO: MOVE TO OTHER PLACE THIS LOGIC!!
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
            .catch((error) => (console.log("failed to gey the user details from server")))
    }, []);

    useEffect(() => {
        setCurrDisplayedComp(<PostsList/>)
    }, []);


    return (
        <div>
            <NavBar/>
            {/*{currDi
            splayedComp}*/}
            <Routes>
                <Route path={"/"} element={<PostsList/>}/>
                <Route path={"/register"} element={<Registration/>}/>
                <Route path={"/login"} element={<UserLogin/>}/>
                <Route path={"/register/user-details"} element={<UserProfileDetailsForm isInRegistrationMode={true}/>}/>
                <Route path={"/my-profile"} element={<MyProfile userProfileDetails={userProfileDetails}/>}/>
                <Route path={"/user-details"} element={<UserProfileDetailsForm isInRegistrationMode={false}/>}/>
                <Route path={"/add-post"} element={<PostForm/>}/>
                {getAccessTokenFromLocalStorage() &&
                    <Route path={"/my-posts"} element={<PostsList filterByUserId={getUserIDFromLocalStorage()!}/>}/>}
                {/*<Route path={"/logout"} handle={() => {logout()}}/>*/}
            </Routes>
        </div>
    );

    // return (
    //     // <Router>
    //     //     <div>
    //     //         <NavBar/>
    //     //         <Route path="/all-posts" Component={PostsList}/>
    //     //         {/*<Route path="/my-profile" Component={MyProfile}/>*/}
    //     //         <Route path="/all-my-posts" Component={AllMyPostsList}/>
    //     //         <Route path="/add-new-post" Component={PostForm}/>
    //     //         <Route path="/login" Component={UserLogin}/>
    //     //         {/*<Route path="/logout" component={Logout}/>*/}
    //     //         {currDisplayedComp}
    //     //     </div>
    //     // </Router>
    // );

    //  return (
    //     <div>
    //         <div className="d-flex justify-content-center position-relative">
    //             {accessToken &&
    //                 <div>
    //                     <button type="button" onClick={() => setCurrDisplayedComp(<PostForm/>)}
    //                             className="btn btn btn-primary">Add Post
    //                     </button>
    //                     <button type="button"
    //                             onClick={() => setCurrDisplayedComp(<MyProfile userProfileDetails={userProfileDetails}/>)}
    //                             className="btn btn btn-primary">My Profile
    //                     </button>
    //                     <button type="button" onClick={logout}
    //                             className="btn btn btn-outline-danger">Logout
    //                     </button>
    //                 </div>
    //             }
    //             {(!accessToken) &&
    //                 <button type="button" onClick={() => setCurrDisplayedComp(<Registration/>)}
    //                         className="btn btn btn-primary">Registration
    //                 </button>}
    //         </div>
    //         <div>
    //             {currDisplayedComp}
    //
    //         </div>
    //
    //     </div>
    // )
}

export default App
