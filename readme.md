Run the app locally with `npm run dev`

Run using docker with

docker build -t contilio/docker-nextjs  .

docker run -d -p 3333:3000 contilio/docker-nextjs:latest


stop all containers:
docker kill $(docker ps -q)

remove all containers
docker rm $(docker ps -a -q)

remove all docker images
docker rmi $(docker images -q)