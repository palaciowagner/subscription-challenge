import { Kafka, KafkaConfig } from 'kafkajs'
import { KAFKA_CLIENT_ID, KAFKA_BROKER } from '@config';

const kafkaConnection: KafkaConfig = {
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER],
}

export const kafka = new Kafka(kafkaConnection);