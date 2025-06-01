export enum ERPSystem {
  SAP = 'SAP',
  ORACLE = 'ORACLE',
  NETSUITE = 'NETSUITE',
}

export interface ERPConfig {
  system: ERPSystem;
  baseUrl: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

export interface ERPData {
  partNumber: string;
  description: string;
  revision: string;
  status: string;
  metadata: {
    [key: string]: any;
    source: ERPSystem;
  };
} 