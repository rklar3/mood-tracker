## Getting Started

This is a basic mood tracking app that allows you to add moods, view them, and choose custom words for each mood. You also have the ability to customize the color associated with each type of mood.

To run this project locally, you'll need to set up a Firebase project and add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

After setting up the environment variables, install the required dependencies and start the development server with the following commands:

```
npm install
npm run dev
```

You can also view the live demo of the project at:  [mood track demo](https://mood-tracker-beta.vercel.app/)

For local development, ensure you have Firebase set up and environment variables configured. If you prefer not to set up Firebase locally, you can use the live demo website.
