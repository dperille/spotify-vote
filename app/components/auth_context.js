import React from 'react';

const AuthContext = React.createContext();

const AuthContextProvider = props => {
    const [choseHostJoin, setChoseHostJoin] = React.useState(false);
    const [isHost, setIsHost] = React.useState(false);
    const [roomNumber, setRoomNumber] = React.useState(null);
    const [inRoom, setInRoom] = React.useState(false);
    const [spotifyAuthorized, setSpotifyAuthorized] = React.useState(false);
    const [spotifyAccessToken, setAccessToken] = React.useState(null);
    const [spotifyRefreshToken, setRefreshToken] = React.useState(null);

    return (
        <AuthContext.Provider value={{
            choseHostJoin: [choseHostJoin, setChoseHostJoin],
            isHost: [isHost, setIsHost],
            roomNumber: [roomNumber, setRoomNumber],
            inRoom: [inRoom, setInRoom],
            spotifyAuthorized: [spotifyAuthorized, setSpotifyAuthorized],
            spotifyAccessToken: [spotifyAccessToken, setAccessToken],
            spotifyRefreshToken: [spotifyRefreshToken, setRefreshToken],
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider };
