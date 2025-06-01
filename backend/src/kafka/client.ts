import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { TOPICS } from './topics';

// Kafka client configuration
const kafka = new Kafka({
  clientId: 'productcenter',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_SASL_ENABLED === 'true' ? {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME || '',
    password: process.env.KAFKA_SASL_PASSWORD || '',
  } : undefined,
});

// Create producer instance
export const producer: Producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});

// Create consumer instance
export const consumer: Consumer = kafka.consumer({
  groupId: 'productcenter-group',
  maxWaitTimeInMs: 1000,
  maxBytes: 1048576, // 1MB
});

// Initialize Kafka connections
export async function initializeKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('Kafka connections established');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    throw error;
  }
}

// Disconnect Kafka connections
export async function disconnectKafka() {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log('Kafka connections closed');
  } catch (error) {
    console.error('Failed to disconnect from Kafka:', error);
    throw error;
  }
}

// Subscribe to topics
export async function subscribeToTopics(
  topics: string[],
  handler: (payload: EachMessagePayload) => Promise<void>
) {
  try {
    await Promise.all(
      topics.map(async (topic) => {
        await consumer.subscribe({ topic, fromBeginning: false });
      })
    );

    await consumer.run({
      eachMessage: async (payload) => {
        try {
          await handler(payload);
        } catch (error) {
          console.error(`Error processing message from topic ${payload.topic}:`, error);
          // Implement retry logic or dead letter queue here
        }
      },
    });

    console.log(`Subscribed to topics: ${topics.join(', ')}`);
  } catch (error) {
    console.error('Failed to subscribe to topics:', error);
    throw error;
  }
}

// Send message to topic
export async function sendMessage(
  topic: string,
  message: any,
  key?: string
) {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: key || undefined,
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });
  } catch (error) {
    console.error(`Failed to send message to topic ${topic}:`, error);
    throw error;
  }
}

// Send message to multiple topics
export async function sendMessageToTopics(
  topics: string[],
  message: any,
  key?: string
) {
  try {
    await Promise.all(
      topics.map((topic) => sendMessage(topic, message, key))
    );
  } catch (error) {
    console.error('Failed to send message to topics:', error);
    throw error;
  }
}

// Helper function to get all topics
export function getAllTopics(): string[] {
  return Object.values(TOPICS).reduce((acc: string[], category) => {
    if (typeof category === 'string') {
      acc.push(category);
    } else {
      Object.values(category).forEach((topic) => {
        if (typeof topic === 'string') {
          acc.push(topic);
        } else {
          Object.values(topic).forEach((t) => {
            if (typeof t === 'string') {
              acc.push(t);
            }
          });
        }
      });
    }
    return acc;
  }, []);
} 