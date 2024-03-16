import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import {RecoilRoot} from "recoil";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    //TODO: GIT IGNORE?/ENV for client id?
    <GoogleOAuthProvider clientId="668098232087-8520nnnd5g8nqm0d6agrpo3ockkfnldn.apps.googleusercontent.com">
        <React.StrictMode>
            <BrowserRouter>
            <RecoilRoot>
                <App/>
            </RecoilRoot>
            </BrowserRouter>
        </React.StrictMode>
    </GoogleOAuthProvider>
)
