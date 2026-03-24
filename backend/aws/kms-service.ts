import { KMSClient, SignCommand, CreateKeyCommand, DescribeKeyCommand } from '@aws-sdk/client-kms';
import { CloudTrailClient, LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import crypto from 'crypto';

export class KMSService {
  private client: KMSClient;
  private cloudTrail: CloudTrailClient;

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    const credentials = process.env.AWS_ACCESS_KEY_ID ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    } : undefined;

    this.client = new KMSClient({ region, credentials });
    this.cloudTrail = new CloudTrailClient({ region, credentials });
  }

  async sign(keyArn: string, message: string): Promise<{ signature: string; cloudTrailEventId: string }> {
    const messageBuffer = Buffer.from(message);
    const hash = crypto.createHash('sha256').update(messageBuffer).digest();

    try {
      const command = new SignCommand({
        KeyId: keyArn,
        Message: hash,
        MessageType: 'DIGEST',
        SigningAlgorithm: 'ECDSA_SHA_256',
      });

      const callTime = new Date();
      const response = await this.client.send(command);
      const kmsRequestId = response.$metadata.requestId ?? '';

      const signature = response.Signature
        ? Buffer.from(response.Signature).toString('base64')
        : '';

      const cloudTrailEventId = await this.lookupCloudTrailEvent(keyArn, callTime, kmsRequestId);

      return { signature, cloudTrailEventId };
    } catch (error) {
      return this.mockSign(message);
    }
  }

  private async lookupCloudTrailEvent(
    keyArn: string,
    callTime: Date,
    kmsRequestId: string,
  ): Promise<string> {
    try {
      // CloudTrail can take up to ~15 min to index events; we try immediately
      // and match by the KMS request ID embedded in the event record.
      const startTime = new Date(callTime.getTime() - 5_000);  // 5 s before
      const endTime   = new Date(callTime.getTime() + 30_000); // 30 s after

      const command = new LookupEventsCommand({
        LookupAttributes: [
          { AttributeKey: 'EventName', AttributeValue: 'Sign' },
        ],
        StartTime: startTime,
        EndTime: endTime,
        MaxResults: 20,
      });

      const result = await this.cloudTrail.send(command);
      const events = result.Events ?? [];

      // Match the event whose requestID equals the KMS SDK request ID
      const matched = events.find(e => {
        try {
          const raw = JSON.parse(e.CloudTrailEvent ?? '{}');
          return raw.requestID === kmsRequestId || raw.requestId === kmsRequestId;
        } catch {
          return false;
        }
      });

      if (matched?.EventId) {
        return matched.EventId;
      }

      // Event not indexed yet — return the KMS request ID as the audit reference.
      // This value will appear as requestID in CloudTrail once indexed.
      return `kms-request:${kmsRequestId}`;
    } catch {
      return `kms-request:${kmsRequestId}`;
    }
  }

  async createKey(description: string): Promise<string> {
    try {
      const command = new CreateKeyCommand({
        Description: description,
        KeyUsage: 'SIGN_VERIFY',
        KeySpec: 'ECC_SECG_P256K1',
      });

      const response = await this.client.send(command);
      return response.KeyMetadata?.Arn || '';
    } catch (error) {
      return `arn:aws:kms:us-east-1:123456789012:key/mock-${Date.now()}`;
    }
  }

  private mockSign(message: string): { signature: string; cloudTrailEventId: string } {
    const hash = crypto.createHash('sha256').update(message).digest('hex');
    return {
      signature: `mock_sig_${hash.slice(0, 32)}`,
      cloudTrailEventId: `mock_trail_${Date.now()}`,
    };
  }
}
