# Websocket.io

## Intro (it's a chatroom)

Socket.io enables real-time, bidirectional and event-based communication. According to the Socket.io documentation:

> Sockets have traditionally been the solution around which most real-time chat systems are architected, providing a bi-directional communication channel between a client and a server.
>
> This means that the server can push messages to clients. Whenever you write a chat message, the idea is that the server will get it and push it to all other connected clients.

This is also my first project using Typescript, Webpack, and Babel. I first just wanted to try out the Websocket API so I built a quick wireframe using vanilla Javascript. Once I had the basics of that set up I decided I wanted to use Webpack/Babel to deal with the notoriously difficult configuration. Initially I wanted to use Parcel but could not get Socket.io to work effectively with it. Once Webpack and Babel were working with Sass, I decided to take it one step further and throw in Typescript for good measure.

Currently this is a bare-bones app where most of the work is hidden away in the configuration. Now that all the configuration is working I plan to add more features. Currently hosted on Heroku at http://bq-chat.herokuapp.com

## Built With

- HTML/SCSS
- Babel/Webpack
- Javascript (Typescript)
- Socket.io
- Node/Express

## Features

- Real-time chat between multiple users
- Nicknames for individual users
- Concurrently updating user list

## Future features

- Private messaging
- Private rooms
- Typing notification

## Learning points

### Socket.io

According to the Socket.io [docs](https://socket.io/get-started/chat/), the socket is defined in the index.html file on the client side

```HTML
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
</script>
```

and then later referenced directly using syntax like `socket.emit('message', message)`. This works fine when using regular Javascript and HTML but caused a lot of issues when trying to bundle the project using Parcel or Webpack. Because I was importing a stylesheet at the top of my Javascript Webpack automatically treats the page like a module and needed everything variable initialized on that page. This required me to import io from the package and define the socket in my Javascript file. Later, when implementing Typescript, in order to get the @types file to work it needed the specific syntax of `import * as io from 'socket.io-client'`

### Webpack/Babel

Webpack essentially acts as a scaffolding for your project that uses different loaders to customize how and what gets packaged. As for the config:

- Entry: The first thing Webpack finds and then expands outward from there
- Output: Where the bundled Javascript ends up
- Resolve: The order in which files with the same name are resolved and allows the user to leave off the extension when importing
- Module: Configures the loaders, presets, and options for Webpack
- Test: Applies selected loaders to files that match this pattern
- Loaders: How your code is compiled. The last loader in the array is executed first.
- Options: Normally with just Javascript and Babel only .js files are targeted and babel-loader is used. You have the option to use .babelrc in your root folder to set your config but you can also set your presets in the Webpack config or in your package.json. I opted for the .babelrc since most docs use that as the format.
- Exclude: In order to speed up the Webpack process or select files to be ignored, their paths go here.
- As a sidenote some older tutorials online will use babel-core and babel-preset-env which are now outdated for the now preferred @babel/core and @babel/env format (as of 5/2019)
- Typescript also requires the options `useBabel` and `babelCore` to run according to the TS docs.
- Source-map-loader is a loader that allows other tools to parse Typescript files for things like testing.

### Typescript

Typescript was probably the easiest to configure but also the least intuitive to implement. There are still things here I need to do a deeper dive on like Interfaces, tagging, and when its acceptable/not acceptable to have an implicit type. It's also interesting to see how the imports work.
