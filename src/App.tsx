import {useEffect} from "react";
import Registration from "./components/Registration.tsx";
import {useRecoilState} from "recoil";
import {
    accessTokenState,
    currentDisplayedComponentState,
    idTokenState,
    refreshTokenState
} from "./stateManagement/RecoilState.ts";
import {
    deleteAccessTokenFromLocalStorage,
    deleteIdTokenFromLocalStorage,
    deleteRefreshTokenFromLocalStorage,
    saveAccessTokenInLocalStorage,
    saveIdTokenInLocalStorage,
    saveRefreshTokenInLocalStorage
} from "./services/token-service.ts";


function App() {
    // const [connectedUserDetails, setConnectedUserDetails] = useState<RegistrationDetails>();
    const [currDisplayedComp] = useRecoilState(currentDisplayedComponentState);

    const [accessToken] = useRecoilState(accessTokenState);
    const [refreshToken] = useRecoilState(refreshTokenState);
    const [idToken] = useRecoilState(idTokenState);


    const isUserConnected = () => {
        return accessToken;
    }

    //TODO: MOVE TO OTHER PLACE THIS LOGIC!!
    useEffect(() => {
        accessToken ? saveAccessTokenInLocalStorage(accessToken) : deleteAccessTokenFromLocalStorage();
    }, [accessToken]);

    useEffect(() => {
        refreshToken ? saveRefreshTokenInLocalStorage(refreshToken) : deleteRefreshTokenFromLocalStorage();
    }, [refreshToken]);

    useEffect(() => {
        idToken ? saveIdTokenInLocalStorage(idToken) : deleteIdTokenFromLocalStorage();
    }, [idToken]);


    return (
        <div>
            {isUserConnected() && currDisplayedComp}
            {!isUserConnected() && <Registration/>}

        </div>
    )
}

export default App
