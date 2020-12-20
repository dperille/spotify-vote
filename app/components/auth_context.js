import React from 'react';

const AuthContext = React.createContext();

const AuthContextProvider = props => {
    const [choseHostJoin, setChoseHostJoin] = React.useState(false);
    const [isHost, setIsHost] = React.useState(false);
    const [roomNumber, setRoomNumber] = React.useState(null);
    const [inRoom, setInRoom] = React.useState(false);

    // TODO - Default to true for now to move past it, but
    // change when implementing spotify auth
    const [spotifyAuthorized, setSpotifyAuthorized] = React.useState(false);

    return (
        <AuthContext.Provider value={{
            choseHostJoin: [choseHostJoin, setChoseHostJoin],
            isHost: [isHost, setIsHost],
            roomNumber: [roomNumber, setRoomNumber],
            inRoom: [inRoom, setInRoom],
            spotifyAuthorized: [spotifyAuthorized, setSpotifyAuthorized],
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider };
