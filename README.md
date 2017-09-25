Firechat is a tiny chat application to demonstrate the use of apollo-link-webworker and firebase to handle graphql on the client side only

# Logging in with Github
If you want to test the application, you might need to accept the popup. Popup gets actually blocked by the vast majority of browsers because the popup is not triggered by an user action.

# Installing
```
git clone https://github.com/PCreations/firechat.git
cd firechat
cp .env .env.local
yarn
```

# Create your own firebase project

Then you will have to edit some configuration file with your information :

*firechat/.firebaserc*
```
{
  "projects": {
    "default": "YOUR_PROJECT_NAME"
  }
}
```

*firechat/.env.local*
```
REACT_APP_FIREBASE_API_KEY="YOUR API KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR AUTH DOMAIN"
REACT_APP_FIREBASE_DATABASE_URL="YOUR DATABASE URL"
REACT_APP_FIREBASE_PROJECT_ID="YOUR PROJECT ID"
```

# Starting and deploying
```
yarn start // localhost
yarn deploy // deploying on firebase hosting
```