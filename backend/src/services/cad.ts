import axios from 'axios';
import { CADConfig, CADData, CADSystem } from '../types/cad';

export class CADService {
  private config: CADConfig;
  private client: any;

  constructor(config: CADConfig) {
    this.config = config;
    this.client = this.initializeClient();
  }

  private initializeClient() {
    switch (this.config.system) {
      case CADSystem.SOLIDWORKS:
        return this.initializeSolidWorksClient();
      case CADSystem.AUTOCAD:
        return this.initializeAutoCADClient();
      case CADSystem.FUSION360:
        return this.initializeFusion360Client();
      default:
        throw new Error(`Unsupported CAD system: ${this.config.system}`);
    }
  }

  private initializeSolidWorksClient() {
    return axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private initializeAutoCADClient() {
    return axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private initializeFusion360Client() {
    return axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getDrawingData(drawingId: string): Promise<CADData> {
    try {
      const response = await this.client.get(`/drawings/${drawingId}`);
      return this.transformCADResponse(response.data);
    } catch (error) {
      console.error('Error fetching drawing data from CAD:', error);
      throw error;
    }
  }

  async getModelData(modelId: string): Promise<CADData> {
    try {
      const response = await this.client.get(`/models/${modelId}`);
      return this.transformCADResponse(response.data);
    } catch (error) {
      console.error('Error fetching model data from CAD:', error);
      throw error;
    }
  }

  async getViewerData(drawingId: string): Promise<CADData> {
    try {
      const response = await this.client.get(`/viewer/${drawingId}`);
      return this.transformCADResponse(response.data);
    } catch (error) {
      console.error('Error fetching viewer data from CAD:', error);
      throw error;
    }
  }

  private transformCADResponse(data: any): CADData {
    // Transform CAD-specific response to common format
    return {
      id: data.id || data.drawingId || data.modelId,
      name: data.name || data.drawingName || data.modelName,
      type: data.type || data.drawingType || data.modelType,
      version: data.version || data.revision || data.rev,
      metadata: {
        ...data,
        source: this.config.system,
      },
      viewerUrl: data.viewerUrl || data.previewUrl || data.thumbnailUrl,
    };
  }
} 