import React, {useEffect, useState} from 'react';
import {Alert} from "react-bootstrap";
import {useRecoilState} from "recoil";
import {alertState} from "../stateManagement/RecoilState.ts";

export interface AlertData {
    message: string | null;
    variant: string;
}
function AlertMessage() {
    const [alertPopup, setAlertPopup] = useRecoilState(alertState);

    useEffect(() => {
        if (alertPopup.message) {
            const timeout = setTimeout(() => {
                setAlertPopup({...alertPopup, message: null})
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [alertPopup]);

    return (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 999 }}>
            {alertPopup.message && (
                <Alert variant={alertPopup.variant} dismissible className="alert-sm">
                    {alertPopup.message}
                </Alert>
            )}
        </div>
    );
}

export default AlertMessage;
