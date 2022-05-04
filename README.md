# 🤖 Asana Bot

A sample portal that manages automations and other scripts on [Asana](https://asana.com).

This portal is designed for [Vercel](https://vercel.com/home?utm_source=next-site&utm_medium=banner&utm_campaign=next-website).

<!-- ![asana-bot screenshot](public/screenshot.png) -->

## Documentation

_TBC in the [Wiki](https://github.com/rubengarciam/asana-bot/wiki) section. It will include full documentation, guides and other information._

## Webhooks

You will need to expose your own services to handle the Asana Webhooks and your workflows' logic.

Some api endpoints have been already deployed to mimmic some possible interactions:

- [asana-bot.vercel.app/api/webhooks](https://asana-bot.vercel.app/api/webhooks)
- [asana-bot.vercel.app/api/new-story](https://asana-bot.vercel.app/api/new-story)
- [asana-bot.vercel.app/api/new-task](https://asana-bot.vercel.app/api/new-task)

## Setup

### OAuth2 and Asana

This app uses OAuth2 for authoriaztion, meaning that users authorize the app to view Asana as them to get task history data.

The overall OAuth flow goes something like this:

- User clicks "sign in" on our app
- User is redirected to Asana, where they authorize the app to use Asana as them.
- User gets redirected back to our app with a code that lets our app use Asana as them for a period of time

This is explained further in the Asana developer docs [here](https://developers.asana.com/docs/oauth). Go through the steps that those docs provide for registering an app.

Take note of the Client ID and Client Secret. We also need to provide a redirect URL. For local development and getting started, enter in `https://localhost:3000/api/auth/callback/asana`

### Environment Variables

To allow the code here to act as the app you just created, create a `.env.local` file in the root directory, and provide the following:

```
NEXT_AUTH_URL=base url for auth redirect, for development this should be [https://localhost:3000]
NEXT_CLIENT_SECRET=client secret from the app you created above
NEXT_CLIENT_ID=client id from the app you created above
NEXT_JWT_ENCRYPTION_KEY={"kty":"oct","kid":"","alg":"A256GCM","k":""} - generate this using `jose newkey -s 256 -t oct -a A256GCM`
NEXT_JWT_SIGNING_KEY={"kty":"oct","kid":"","alg":"HS512","k":""}- `jose newkey -s 512 -t oct -a HS512`
NEXT_JWT_SECRET=random secret string of characters
```

The last set of variables are an encryption key and signing key for the data we store between sessions in order to keep users logged in. To do this, the app saves a cookie in the browser with the access token and a few other details in the form of a JSON Web Token (JWT). So that we don't leak information, this token is encrypted and signed with keys that should be kept secret, and only entered in the env variables.

## Commands

Run development locally:

```batch
npm run dev
```

### Build Locally

Build locally:

```batch
npm run build
```

Start prod locally:

```batch
npm run start
```

### Development Certificates (using https for development)

_Some_ browsers (looking at you, Chrome) don't allow the setting of secure cookies from non-secure (not https) domains, including localhost.

In order to do this, we need to do 3 things:

1. create Certificates and a Certificate Authority locally for localhost
2. store the certificates in this project '/certificates/\[certs\]'
3. update the certs are referenced in server.js

To create certificates we'll be using `mkcert`: https://github.com/FiloSottile/mkcert

Install mkcert following the instructions above. on mac using Homebrew:

```
brew install mkcert
```

Once installed, run:

```
mkcert -install
mkcert localhost
```

It will drop the certificate and certificate key in your current directory as something like `localhost-key.pem` and `localhost.pem`

Move these two files to a folder in the root directory of this project called `certificates`, or whatever other folder you like _but make sure you add this folder to your .gitignore_ and do not share these anywhere outside of your local development environment.

Finally, modify the lines in `server.js` to reference this location:

```
const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost-key.pem"),
  cert: fs.readFileSync("./certificates/localhost.pem"),
};
```

If these keys ever leak, remove them and delete them using:

```
mkcert -uninstall
rm -r "$(mkcert -CAROOT)"
```

### Deploy to Vercel

Deploy to Vercel in preview:

```batch
vercel
```

Deploy to Vercel in production:

```batch
vercel --prod
```

## Dependencies

This project uses the following external libraries 🙌 :

- [Axios](https://github.com/axios/axios)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com) and [Headless UI](https://headlessui.dev)

[React](http://reactjs.org) specific libraries:

- [http-status-codes](https://github.com/prettymuchbryce/http-status-codes)
- [iron-session](https://github.com/vvo/iron-session)
- [react-json-editor-ajrm](https://github.com/AndrewRedican/react-json-editor-ajrm#readme)
- [react-responsive](https://github.com/contra/react-responsive)
- [react-transition-group](http://reactcommunity.org/react-transition-group/)
- [swr](https://github.com/vercel/swr)
