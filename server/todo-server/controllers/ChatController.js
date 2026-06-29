'use strict';

const Controller  = require('./Controller');
const ChatService = require('../services/ChatService');

class ChatController {
  /** POST /chat */
  static async chat(req, res) {
    await Controller.handleRequest(req, res, () =>
      ChatService.chat(Controller.collectParams(req))
    );
  }
}

module.exports = ChatController;
