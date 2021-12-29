import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from "socket.io";
import http from "http";
import * as socket from '../sockets/socket';
export default class Server {

  private static _intance: Server;
  public app: express.Application;
  public port: number;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {

    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);

    // this.io = socketIO( this.httpServer);
    this.io=require("socket.io")(this.httpServer, {
      cors: {
          origin: true,
          credentials: true
        },            
    });

    this.escucharSockets();

  }
  
  
  public static get instance() {
    return this._intance || (this._intance = new this());
  }
  
  private escucharSockets() {

    console.log("Escuchando conexiones - Sockets");

    this.io.on('connection', cliente => {

      console.log(cliente.id);

      // Conectar Cliente
      socket.conectarCliente(cliente);

      // Configurar Usuario
      socket.configurarUsuario(cliente, this.io);
      
      // Mensajes
      socket.mensaje(cliente, this.io);
      
      //Desconectar cliente
      socket.desconectar(cliente);

      
      
    });
    

  }


  //start(callback: Function): void {
  start(callback?: () => void): void {
    
    this.httpServer.listen(this.port, callback);
    
  }

}