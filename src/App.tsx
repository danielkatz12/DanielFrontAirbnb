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
import MyProfile from "./components/MyProfile.tsx";
import PostForm from "./components/PostForm.tsx";
import Registration from "./components/Registration.tsx";


function App() {
    // const [connectedUserDetails, setConnectedUserDetails] = useState<RegistrationDetails>();
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);


    const logout = () => {
        clearAllFromLocalStorage();
        setAccessToken(undefined);
        setRefreshToken(undefined);
        setIdToken(undefined);
        alert("user is now Logout")
    }

    //TODO: MOVE TO OTHER PLACE THIS LOGIC!!
    useEffect(() => {
        accessToken && saveAccessTokenInLocalStorage(accessToken);
    }, [accessToken]);

    useEffect(() => {
        refreshToken && saveRefreshTokenInLocalStorage(refreshToken);
    }, [refreshToken]);

    useEffect(() => {
        idToken && saveIdTokenInLocalStorage(idToken);
    }, [idToken]);
    useEffect(() => {
        getAccessTokenFromLocalStorage() && getUserIDFromLocalStorage() &&
        getMyUserProfileDetails(getUserIDFromLocalStorage()!)
            .then((value) => setUserProfileDetails(value))
            .catch((error) => (console.log("failed to gey the uder details from server")))
    }, []);

    useEffect(() => {
        setCurrDisplayedComp(<PostsList/>)
    }, []);


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

    return (
        <div>
            <div className="d-flex justify-content-center position-relative">
                {accessToken &&
                    <div>
                        <button type="button" onClick={() => setCurrDisplayedComp(<PostForm/>)}
                                className="btn btn btn-primary">Add Post
                        </button>
                        <button type="button"
                                onClick={() => setCurrDisplayedComp(<MyProfile userProfileDetails={userProfileDetails}/>)}
                                className="btn btn btn-primary">My Profile
                        </button>
                        <button type="button" onClick={logout}
                                className="btn btn btn-outline-danger">Logout
                        </button>
                    </div>
                }
                {(!accessToken) &&
                    <button type="button" onClick={() => setCurrDisplayedComp(<Registration/>)}
                            className="btn btn btn-primary">Registration
                    </button>}
            </div>
            <div>
                {currDisplayedComp}

            </div>

        </div>
    )
}

export default App
