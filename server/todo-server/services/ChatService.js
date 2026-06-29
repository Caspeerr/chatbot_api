'use strict';

const Service = require('./Service');

class ChatService {
  static async chat({ body } = {}) {
    try {
      const message = body?.message?.trim();
      if (!message) {
        return Service.rejectResponse('message is required', 400, 'VALIDATION_ERROR');
      }

      const reply = ChatService.generateReply(message);
      return Service.successResponse({ reply });
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  static generateReply(message) {
    const normalized = message.trim().toLowerCase();

    if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/.test(normalized)) {
      return 'Hello! I am your friendly chatbot. Ask me anything or just say hi.';
    }

    if (/\b(help|what can you do|how do i use)\b/.test(normalized)) {
      return 'I can reply to simple messages, tell the current time or date, and answer a few chat queries. Try asking for a joke or the current time.';
    }

    if (/\b(time|current time)\b/.test(normalized)) {
      return `The current time is ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`;
    }

    if (/\b(date|today)\b/.test(normalized)) {
      return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`;
    }

    if (/\b(joke|tell me a joke|funny)\b/.test(normalized)) {
      return 'Why did the programmer quit his job? Because he didn\'t get arrays.';
    }

    if (/\b(weather)\b/.test(normalized)) {
      return 'I do not have live weather data yet, but I can still chat with you!';
    }

    if (/\b(bye|goodbye|see you|later)\b/.test(normalized)) {
      return 'Goodbye! Feel free to come back when you want to chat again.';
    }

    return `You said: "${message}". I\'m a demo chatbot and I\'m here to respond.`;
  }
}

module.exports = ChatService;
