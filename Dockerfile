FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

# configure npm to run faster and avoir timeout error
RUN npm config set registry http://registry.npmjs.org/
RUN npm config set loglevel info
RUN npm config set fetch-retries 3
RUN npm config set fetch-retry-mintimeout 15000
RUN npm config set fetch-retry-maxtimeout 6000000
RUN npm config set cache-min 86400

# install app dependencies
RUN npm install --prefer-offline --no-audit
RUN npm install react-scripts@4.0.3 -g --silent

# add app
COPY . ./
CMD ["npm", "start"]