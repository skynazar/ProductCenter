export enum CADSystem {
  SOLIDWORKS = 'SOLIDWORKS',
  AUTOCAD = 'AUTOCAD',
  FUSION360 = 'FUSION360',
}

export interface CADConfig {
  system: CADSystem;
  baseUrl: string;
  apiKey: string;
}

export interface CADData {
  id: string;
  name: string;
  type: string;
  version: string;
  metadata: {
    [key: string]: any;
    source: CADSystem;
  };
  viewerUrl: string;
} 