import io from 'socket.io-client';

// Connect to Flask-SocketIO server
const socket = io('http://localhost:5000');  