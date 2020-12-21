import * as AuthSession from 'expo-auth-session';
import { acc } from 'react-native-reanimated';
import { spotifyCredentials } from '../secrets.js';

class SpotifyAuthHandler {

  constructor() {
    // spotify authentication parameters
    this.config = { 
      clientId: spotifyCredentials['clientId'],
      clientSecret: spotifyCredentials['clientSecret'],
      response_type: 'code',
      redirect_uri: 'https://auth.expo.io/@dperille/app',
      scopes: [
        'playlist-read-private',
      ],
      endpoints: {
        authorization: 'https://accounts.spotify.com/authorize',
        token: 'https://accounts.spotify.com/api/token',
      },
      grant_type: 'authorization_code',
    }
  }

  /* User is going to log in to Spotify. Handles first two steps in
     Spotify's Authorization Code Flow.
     1) User logs in and authorizes access; returns authorization code
     2) Exchange authorization code for access and refresh tokens */
  async onLogin() {
    try {
      /* 1. User logs in and authorizes access. Gets auth code. */
      const authResults = await AuthSession.startAsync({
        authUrl: this.constructAuthGETString(),
      });

      if(authResults.type != 'success'){
        return null;
      }


      /* 2. Use authorization code to request access and
            refresh tokens. */
      const accessResults = await AuthSession.exchangeCodeAsync({
        clientId: this.config['clientId'],
        clientSecret: this.config['clientSecret'],
        redirectUri: this.config['redirect_uri'],
        code: authResults['params']['code'],
        extraParams: {
          grant_type: this.config['grant_type'],
        }
      }, { tokenEndpoint: this.config['endpoints']['token'] });

      return {
        accessToken: accessResults['accessToken'],
        refreshToken: accessResults['refreshToken'],
      };
    } 
    catch (error) {
      return null;
    }
  }

  // constructs the url for the initial spotify authentication GET request (step 1)
  constructAuthGETString() {
    const params = {
      response_type: this.config['response_type'],
      client_id: this.config['clientId'],
      scope: this.config['scopes'],
      redirect_uri: this.config['redirect_uri'],
    };

    // package all the parameters into a URI-encoded string for the fetch() call
    let url = Object.entries(params)
                      .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
                      .join('&')

    url = this.config['endpoints']['authorization'] + '?' + url;
    return url;
  }

  // refreshes the access token using the provided refresh token
  async refreshLogin(refreshToken) {
    const result = await AuthSession.refreshAsync({
      clientId: this.config['clientId'],
      clientSecret: this.config['clientSecret'],
      redirectUri: this.config['redirect_uri'],
      refreshToken: refreshToken,
      extraParams: {
        grant_type: this.config['grant_type'],
      },
    }, { tokenEndpoint: this.config['endpoints']['token'] });

    return result['access_token'];
  }
}

const spotifyAuthHandler = new SpotifyAuthHandler();
export default spotifyAuthHandler;
