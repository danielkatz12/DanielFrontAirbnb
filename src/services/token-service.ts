export function saveIdTokenInLocalStorage(idToken: string): void {
    localStorage.setItem("idToken", idToken);
}

export function getIdTokenFromLocalStorage(): string | null {
    return localStorage.getItem("idToken");
}

export function deleteIdTokenFromLocalStorage(): void {
    localStorage.removeItem("idToken");
}


export function saveAccessTokenInLocalStorage(accessToken: string): void {
    localStorage.setItem("accessToken", accessToken);
}

export function getAccessTokenFromLocalStorage(): string | null {
    return localStorage.getItem("accessToken");
}

export function deleteAccessTokenFromLocalStorage(): void {
    localStorage.removeItem("accessToken");
}


export function saveRefreshTokenInLocalStorage(refreshToken: string): void {
    localStorage.setItem("refreshToken", refreshToken);
}

export function getRefreshTokenFromLocalStorage(): string | null {
    return localStorage.getItem("refreshToken");
}

export function deleteRefreshTokenFromLocalStorage(): void {
    localStorage.removeItem("refreshToken");
}

export function clearAllFromLocalStorage(): void {
    localStorage.clear();
}

export function saveUserIDInLocalStorage(userId: string): void {
    localStorage.setItem("userId", userId);
}

export function getUserIDFromLocalStorage(): string | null {
    return localStorage.getItem("userId");
}

export function deleteUserIDInLocalStorage(): void {
    localStorage.removeItem("userId");
}
