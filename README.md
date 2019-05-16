# Websocket.io

## Intro (it's a chatroom)

Websocket.io uses Socket.io to take advantage of the Websocket API. Socket.io enables real-time, bidirectional and event-based communication. According to the Socket.io documentation.

> Writing a chat application with popular web applications stacks like LAMP (PHP) has traditionally been very hard. It involves polling the server for changes, keeping track of timestamps, and it’s a lot slower than it should be.
>
> Sockets have traditionally been the solution around which most real-time chat systems are architected, providing a bi-directional communication channel between a client and a server.
>
> This means that the server can push messages to clients. Whenever you write a chat message, the idea is that the server will get it and push it to all other connected clients.

## Features

- Real-time chat between multiple users
- Nicknames for individual users
- Concurrently updating user list

## Future features

- Private messaging
- Private rooms
- Typing notification

## Deployment

Hosted on Heroku at http://bq-chat.herokuapp.com
