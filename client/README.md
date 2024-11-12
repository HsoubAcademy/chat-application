## Frontend

### Setup `Local`

In the project directory, go to client dir:

- Install dependencies by `npm install`.
- Create a copy of .env.example file to .env `cp .env.example .env`.
- In `.env` file set your server url `REACT_APP_API_URL`.
- Start application by `npm start`.

### Setup `Production - Remote`

In the project directory, go to client dir:

- Install dependencies by `npm install`.
- Create a copy of .env.example file to .env `cp .env.example .env`.
- Set your server url `REACT_APP_API_URL`.
- Start application by `npm run build`.
- Move all contents of `build` dir to `server/public/`.
- Run the application by request node application url.
