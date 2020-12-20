import * as AuthSession from 'expo-auth-session';
import { spotifyCredentials } from '../secrets.js';

class SpotifyAuthHandler {

  constructor(props) {
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
    }
  }

  // user going to log in
  async onLogin() {
    try {
      // open spotify authentication session
      let results = await AuthSession.startAsync({
        authUrl: this.constructGETString(),
      });

      if(results.type == 'success'){
        // return the authorization code from Spotify API
        console.log(results['params']['code']);
        return results['params']['code'];
      }
      else {
        // display that authentication failed
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // constructs the url for the initial spotify authentication GET request
  constructGETString() {
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

  async refreshLogin() {

  }
}

const spotifyAuthHandler = new SpotifyAuthHandler();
export default spotifyAuthHandler;
