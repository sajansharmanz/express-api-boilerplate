# Backend API

This project is a package that is used to create a backend API.

## How to use

1. Clone repo
2. Create SSL certs (see docs folder for more info)
3. Set environment variables (see docs folder for more info)
4. Run `npm install` on host machine (required for linting)
5. Run `make up-dev`
6. Run `docker ps` to get a list of running containers
7. Run `docker exec -it [API CONTAINER ID] sh`
8. Run existing database migrations `npm run prisma:migrate`
9. Run database seed `npm run prisma:seed`
10. You're good to go!

## Notes

- Run all NPM commands from the container
- Create all migrations from the container
