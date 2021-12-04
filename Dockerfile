FROM node
ENV NPM_CONFIG_LOGLEVEL info
COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT ["npm", "start"]

# docker build -t graphql-container .
# 
# For Development Container
# docker run -dt --network host -e NODE_ENV='development' --name=graphql-container -v $PWD:/app graphql-container
# 
# For Production Container
# docker run -dt --restart=always --network host -e NODE_ENV='production' --name=graphql-container -v $PWD:/app graphql-container
# 
# Remove the container
# docker rm -f graphql-container

# docker logs --follow graphql-container
# docker exec -it graphql-container bash
