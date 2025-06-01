import axios from 'axios';
import { ERPConfig, ERPData, ERPSystem } from '../types/erp';

export class ERPService {
  private config: ERPConfig;
  private client: any;

  constructor(config: ERPConfig) {
    this.config = config;
    this.client = this.initializeClient();
  }

  private initializeClient() {
    switch (this.config.system) {
      case ERPSystem.SAP:
        return this.initializeSAPClient();
      case ERPSystem.ORACLE:
        return this.initializeOracleClient();
      case ERPSystem.NETSUITE:
        return this.initializeNetSuiteClient();
      default:
        throw new Error(`Unsupported ERP system: ${this.config.system}`);
    }
  }

  private initializeSAPClient() {
    return axios.create({
      baseURL: this.config.baseUrl,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private initializeOracleClient() {
    return axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private initializeNetSuiteClient() {
    return axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getPartData(partNumber: string): Promise<ERPData> {
    try {
      const response = await this.client.get(`/parts/${partNumber}`);
      return this.transformERPResponse(response.data);
    } catch (error) {
      console.error('Error fetching part data from ERP:', error);
      throw error;
    }
  }

  async getBOMData(partNumber: string): Promise<ERPData> {
    try {
      const response = await this.client.get(`/bom/${partNumber}`);
      return this.transformERPResponse(response.data);
    } catch (error) {
      console.error('Error fetching BOM data from ERP:', error);
      throw error;
    }
  }

  async getInventoryData(partNumber: string): Promise<ERPData> {
    try {
      const response = await this.client.get(`/inventory/${partNumber}`);
      return this.transformERPResponse(response.data);
    } catch (error) {
      console.error('Error fetching inventory data from ERP:', error);
      throw error;
    }
  }

  private transformERPResponse(data: any): ERPData {
    // Transform ERP-specific response to common format
    return {
      partNumber: data.partNumber || data.materialNumber || data.itemId,
      description: data.description || data.materialDescription || data.itemDescription,
      revision: data.revision || data.version || data.rev,
      status: data.status || data.materialStatus || data.itemStatus,
      metadata: {
        ...data,
        source: this.config.system,
      },
    };
  }
} 