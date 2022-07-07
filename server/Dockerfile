FROM node:16.15.0-slim
ENV NODE_ENV=production

RUN apt-get update
RUN apt-get install python3-pip -y
RUN apt-get install ffmpeg -y

RUN python3 -m pip install --upgrade pip setuptools wheel
RUN pip3 install librosa
RUN pip3 install yt_dlp
RUN pip3 install tensorflow

# WORKDIR /app
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 5000

CMD ["npm", "run", "server"]