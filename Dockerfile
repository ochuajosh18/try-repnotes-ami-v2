FROM node:12.21.0-alpine as build
ARG COMMAND

ENV COMMAND $COMMAND
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
COPY .env.development ./
COPY . ./
RUN yarn
RUN  yarn global add react-scripts@3.4.1 --silent
RUN yarn run ${COMMAND}
COPY public ./
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/try-repnotes-ami-v2/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon;"]