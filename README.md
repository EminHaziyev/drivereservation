# Drive Reservation System

This is a drive reservation system built with Node.js, Express, and MongoDB. It allows drivers to create drives and passengers to reserve seats on those drives.


## Usage

- Sign up as a driver: Fill out the driver sign-up form to create a driver account.
- Sign up as a passenger: Fill out the passenger sign-up form to create a passenger account.
- Log in: Log in as a driver or passenger using the provided credentials.
- Dashboard:
  - Drivers: Drivers can view and manage their drives on the dashboard. They can create new drives, view existing drives, and see the passengers who have reserved seats on their drives.
  - Passengers: Passengers can view and manage their reserved drives on the dashboard. They can see the drives they have reserved seats on and the details of those drives.
- Drives: Passengers can view all available drives and reserve seats on a drive.

## Directory Structure

The project's directory structure is as follows:

- `views`: Contains the EJS templates for the different views (signup, login, dashboard, drives).
- `public`: Contains static assets such as CSS stylesheets and client-side JavaScript files.
- `app.js`: The main application file where the server is set up, routes are defined, and middleware is configured.

## Dependencies

The project uses the following dependencies:

- Express: Fast and minimalist web framework for Node.js
- EJS: Embedded JavaScript templates for rendering dynamic views
- Body-parser: Middleware for parsing incoming request bodies
- Mongoose: MongoDB object modeling for Node.js
- Express-session: Session middleware for managing user sessions
- Connect-mongodb-session: Session store for MongoDB

## Note
I didn't create this project to release a new website to use. This is an app created by me to practise backend development. Frontend codes are not mine. If you have feedback, feel free to send me:
- Email: ehziyev@gmail.com
- LinkedIn: [Emin Haziyev](https://linkedin.com/in/eminhaziyev)

## License

This project is licensed under the [MIT License](LICENSE).

