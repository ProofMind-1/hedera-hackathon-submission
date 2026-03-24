import axios from 'axios';
import WebSocket from 'ws';

export class MirrorNodeService {
  private mirrorNodeUrl: string;
  private wsConnections: Map<string, WebSocket>;

  constructor() {
    this.mirrorNodeUrl = process.env.MIRROR_NODE_URL || 'https://testnet.mirrornode.hedera.com';
    this.wsConnections = new Map();
  }

  async getTopicMessages(topicId: string, limit: number = 100) {
    try {
      const response = await axios.get(
        `${this.mirrorNodeUrl}/api/v1/topics/${topicId}/messages`,
        { params: { limit } }
      );
      return response.data.messages;
    } catch (error) {
      console.error('Mirror Node query failed:', error);
      return [];
    }
  }

  async getMessageBySequence(topicId: string, sequenceNumber: number) {
    try {
      const response = await axios.get(
        `${this.mirrorNodeUrl}/api/v1/topics/${topicId}/messages/${sequenceNumber}`
      );
      return response.data;
    } catch (error) {
      console.error('Mirror Node message query failed:', error);
      return null;
    }
  }

  subscribeToTopic(topicId: string, callback: (message: any) => void) {
    const wsUrl = `wss://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log(`Subscribed to topic ${topicId}`);
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        callback(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
      console.log(`Disconnected from topic ${topicId}`);
      this.wsConnections.delete(topicId);
    });

    this.wsConnections.set(topicId, ws);
    return ws;
  }

  unsubscribeFromTopic(topicId: string) {
    const ws = this.wsConnections.get(topicId);
    if (ws) {
      ws.close();
      this.wsConnections.delete(topicId);
    }
  }

  async verifyNotarizationOnChain(topicId: string, sequenceNumber: number, expectedHash: string) {
    const message = await this.getMessageBySequence(topicId, sequenceNumber);
    if (!message) return { verified: false, reason: 'Message not found' };

    const messageContent = Buffer.from(message.message, 'base64').toString();
    const messageData = JSON.parse(messageContent);

    const verified = messageData.inputHash === expectedHash || 
                     messageData.outputHash === expectedHash;

    return {
      verified,
      message: messageData,
      consensusTimestamp: message.consensus_timestamp,
    };
  }
}
