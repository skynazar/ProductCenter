import { ERPService } from './services/erp';
import { CADService } from './services/cad';
import { ERPSystem } from './types/erp';
import { CADSystem } from './types/cad';

const erpService = new ERPService({
  system: ERPSystem.SAP, // Configure based on your ERP system
  baseUrl: process.env.ERP_API_URL || '',
  username: process.env.ERP_USERNAME,
  password: process.env.ERP_PASSWORD,
});

const cadService = new CADService({
  system: CADSystem.SOLIDWORKS, // Configure based on your CAD system
  baseUrl: process.env.CAD_API_URL || '',
  apiKey: process.env.CAD_API_KEY || '',
});

export const resolvers = {
  Query: {
    photos: async (_, { limit }, { dataSources }) => {
      return dataSources.photos.getPhotos(limit);
    },
    photo: async (_, { id }, { dataSources }) => {
      return dataSources.photos.getPhoto(id);
    },
    projects: async (_, { limit }, { dataSources }) => {
      return dataSources.projects.getProjects(limit);
    },
    project: async (_, { id }, { dataSources }) => {
      return dataSources.projects.getProject(id);
    },
    erpData: async (_, { partNumber }) => {
      return erpService.getPartData(partNumber);
    },
    cadData: async (_, { id }) => {
      return cadService.getDrawingData(id);
    },
  },

  Mutation: {
    uploadPhoto: async (_, { file, projectId }, { dataSources }) => {
      return dataSources.photos.uploadPhoto(file, projectId);
    },
    createProject: async (_, { name, description }, { dataSources }) => {
      return dataSources.projects.createProject(name, description);
    },
    addComment: async (_, { annotationId, content }, { dataSources }) => {
      return dataSources.comments.addComment(annotationId, content);
    },
  },

  Photo: {
    project: async (photo, _, { dataSources }) => {
      return photo.projectId ? dataSources.projects.getProject(photo.projectId) : null;
    },
  },

  Annotation: {
    photo: async (annotation, _, { dataSources }) => {
      return dataSources.photos.getPhoto(annotation.photoId);
    },
  },
}; 