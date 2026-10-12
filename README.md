# IRCTC Booking

A small train ticket booking app built with React, Redux Toolkit and React Router. The backend is mocked with json-server.

## Features

- Register and login
- Search trains by source, destination, date and quota
- Check seat availability per class
- Add passengers (up to 6 per booking) with berth preference
- Mock payment by UPI or card
- View and cancel bookings
- Saved passengers list
- Admin: add train routes, change user roles

## Running locally

Needs Node 20 or above.

```bash
npm install
cp dbExample.json db.json
npm run server
npm run dev
```

`npm run server` starts json-server on port 3000 and `npm run dev` starts the app on port 5173. Run them in two terminals.

`db.json` is not committed since json-server writes to it. `dbExample.json` has the sample trains and an admin account.

## Login

Admin: `admin` / `Admin@123`

For a normal user, register from the login page.

## Folder structure

```text
src/
  admin/       train routes and users (admin only)
  bookings/    my bookings, cancel ticket
  login/
  register/
  passengers/  saved passengers, passenger details for a booking
  payment/
  profile/
  trains/      search, availability
  store/       redux store, auth and trains slices
```

## Notes

- Passwords are stored as plain text in db.json and login is checked on the client. This is only for the mock server, not how it would be done with a real backend.
- Payment is mocked, no real gateway is called.
- Seat counts are not reduced after a booking.
