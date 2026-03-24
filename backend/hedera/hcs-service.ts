import { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk";

export class HederaService {
  private client: Client;

  constructor(operatorId: string, operatorKey: string) {
    this.client = Client.forTestnet().setOperator(operatorId, operatorKey);
  }

  async createTopic(memo: string): Promise<string> {
    const transaction = new TopicCreateTransaction().setTopicMemo(memo);
    const response = await transaction.execute(this.client);
    const receipt = await response.getReceipt(this.client);
    return receipt.topicId!.toString();
  }

  async createEnterpriseTopics(enterpriseId: string): Promise<Record<string, string>> {
    const topics = {
      decisions: await this.createTopic(`ProofMind.${enterpriseId}.decisions`),
      models: await this.createTopic(`ProofMind.${enterpriseId}.models`),
      anomalies: await this.createTopic(`ProofMind.${enterpriseId}.anomalies`),
      reports: await this.createTopic(`ProofMind.${enterpriseId}.reports`),
      queries: await this.createTopic(`ProofMind.${enterpriseId}.queries`),
      verifications: await this.createTopic(`ProofMind.${enterpriseId}.verifications`),
    };
    return topics;
  }

  async submitNotarization(topicId: string, notarization: any): Promise<bigint> {
    const message = JSON.stringify(notarization);
    const transaction = new TopicMessageSubmitTransaction({
      topicId: TopicId.fromString(topicId),
      message,
    });
    const response = await transaction.execute(this.client);
    const receipt = await response.getReceipt(this.client);
    return receipt.topicSequenceNumber!;
  }
}
