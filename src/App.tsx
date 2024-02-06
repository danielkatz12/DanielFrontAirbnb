import {ReactElement, useEffect, useState} from "react";
import {
    deleteAccessTokenFromLocalStorage, deleteIdTokenFromLocalStorage,
    deleteRefreshTokenFromLocalStorage,
    getAccessTokenFromLocalStorage,
    getIdTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage,
    saveAccessTokenInLocalStorage, saveIdTokenInLocalStorage,
    saveRefreshTokenInLocalStorage
} from "./services/token-service.ts";
import Registration from "./components/Registration.tsx";
import {RegistrationDetails} from "./interfaces/registration-details.ts";
import PostsList from "./PostsList.tsx";


function App() {
    const [connectedUserDetails, setConnectedUserDetails] = useState<RegistrationDetails>();
    const [currOpenedComponent, setCurrOpenedComponent] = useState<ReactElement | undefined>(<PostsList/>);
    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromLocalStorage())
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromLocalStorage())
    const [idToken, setIdToken] = useState<string | null>(getIdTokenFromLocalStorage());


    const isUserConnected = () => {
        return accessToken
    }
    const setConnectedUserDetailsState = (connectedUser: RegistrationDetails) => {
        console.log(connectedUserDetails);//todo: to remove this!!!
        setConnectedUserDetails(connectedUser);
    }
    const changeAccessTokenState = (newAccessToken: string) => {
        setAccessToken(newAccessToken);
    }
    const changeRefreshTokenState = (newRefreshToken: string) => {
        setRefreshToken(newRefreshToken);
    }
    const changeIdTokenState = (newIdToken: string) => {
        setIdToken(newIdToken);
    }

    const changeCurrOpenedComponent = (componentToOpen: ReactElement | undefined) => {
        setCurrOpenedComponent(componentToOpen);
    }

    // const handleTokensWhenUserLogout = () => {
    //     setAccessToken(null);
    //     setRefreshToken(null);
    //     setIdToken(null);
    //     setCurrOpenedComponent(<Registration/>)//Todo: not here!!
    // }


    useEffect(() => {
        accessToken ? saveAccessTokenInLocalStorage(accessToken) : (getAccessTokenFromLocalStorage() && deleteAccessTokenFromLocalStorage());
    }, [accessToken]);

    useEffect(() => {
        refreshToken ? saveRefreshTokenInLocalStorage(refreshToken) : (getRefreshTokenFromLocalStorage() && deleteRefreshTokenFromLocalStorage());
    }, [refreshToken]);

    useEffect(() => {
        idToken ? saveIdTokenInLocalStorage(idToken) : (getIdTokenFromLocalStorage() && deleteIdTokenFromLocalStorage());
    }, [idToken]);


    return (
        <div>
            {/*{currOpenedComponent}*/}
            {isUserConnected() && currOpenedComponent}
            {!isUserConnected() && <Registration setConnectedUserDetails={setConnectedUserDetailsState}
                                                 setAccessToken={changeAccessTokenState}
                                                 setRefreshToken={changeRefreshTokenState}
                                                 setIdToken={changeIdTokenState}
                                                 changeOpenedComponent={changeCurrOpenedComponent}/>}

        </div>
    )
}

export default App
