import { KafkaConfig } from 'kafkajs';

export const kafkaConfig: KafkaConfig = {
  clientId: 'productcenter',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_SASL_ENABLED === 'true' ? {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME || '',
    password: process.env.KAFKA_SASL_PASSWORD || '',
  } : undefined,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
  connectionTimeout: 3000,
  authenticationTimeout: 3000,
};

export const producerConfig = {
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
};

export const consumerConfig = {
  groupId: 'productcenter-group',
  maxWaitTimeInMs: 1000,
  maxBytes: 1048576, // 1MB
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
}; 