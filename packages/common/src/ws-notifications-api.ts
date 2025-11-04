import log from 'electron-log';
export class WsNotificationsApi {
  handleConnection() {
    log.info('WsHandlerModule: Connected to server');
  }
  handleConnectError() {
    log.info('WsHandlerModule: Connection error');
  }
  handleDisconnection() {
    log.info('WsHandlerModule: Server disconnected');
  }
  handlePing() {
    log.info('WsHandlerModule: Pinged server');
  }
  handleReconnectAttempt() {
    log.info('WsHandlerModule: Reconnect attempt');
  }
  handleReconnect() {
    log.info('WsHandlerModule: Reconnected to server');
  }
  handleReconnectError() {
    log.info('WsHandlerModule: Error reconnecting to server');
  }
  handleReconnectFailed() {
    log.info('WsHandlerModule: Failed to Reconnect');
  }
  handleNotification() {
    log.info('WsHandlerModule: Notification');
  }
}
