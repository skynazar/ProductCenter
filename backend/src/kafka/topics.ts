import { z } from 'zod';

// Topic names
export const TOPICS = {
  PHOTO: {
    UPLOAD: 'photo.upload',
    PROCESS: 'photo.process',
    UPDATE: 'photo.update',
    DELETE: 'photo.delete',
  },
  THREAD: {
    CREATE: 'thread.create',
    COMMENT: 'thread.comment',
    UPDATE: 'thread.update',
    DELETE: 'thread.delete',
  },
  PROJECT: {
    CREATE: 'project.create',
    UPDATE: 'project.update',
    DELETE: 'project.delete',
  },
  USER: {
    CREATE: 'user.create',
    UPDATE: 'user.update',
    DELETE: 'user.delete',
  },
  ML: {
    PROCESS: 'ml.process',
    RESULT: 'ml.result',
    ERROR: 'ml.error',
  },
  INTEGRATION: {
    ERP: {
      SYNC: 'integration.erp.sync',
      UPDATE: 'integration.erp.update',
    },
    CAD: {
      SYNC: 'integration.cad.sync',
      UPDATE: 'integration.cad.update',
    },
  },
} as const;

// Event schemas
export const EVENT_SCHEMAS = {
  // Photo events
  [TOPICS.PHOTO.UPLOAD]: z.object({
    photoId: z.string(),
    userId: z.string(),
    projectId: z.string(),
    fileName: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.PHOTO.PROCESS]: z.object({
    photoId: z.string(),
    status: z.enum(['processing', 'completed', 'failed']),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.PHOTO.UPDATE]: z.object({
    photoId: z.string(),
    updates: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }),
  }),

  [TOPICS.PHOTO.DELETE]: z.object({
    photoId: z.string(),
    userId: z.string(),
  }),

  // Thread events
  [TOPICS.THREAD.CREATE]: z.object({
    threadId: z.string(),
    photoId: z.string(),
    userId: z.string(),
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.THREAD.COMMENT]: z.object({
    threadId: z.string(),
    commentId: z.string(),
    userId: z.string(),
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.THREAD.UPDATE]: z.object({
    threadId: z.string(),
    updates: z.object({
      content: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }),
  }),

  [TOPICS.THREAD.DELETE]: z.object({
    threadId: z.string(),
    userId: z.string(),
  }),

  // Project events
  [TOPICS.PROJECT.CREATE]: z.object({
    projectId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    userId: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.PROJECT.UPDATE]: z.object({
    projectId: z.string(),
    updates: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }),
  }),

  [TOPICS.PROJECT.DELETE]: z.object({
    projectId: z.string(),
    userId: z.string(),
  }),

  // User events
  [TOPICS.USER.CREATE]: z.object({
    userId: z.string(),
    email: z.string().email(),
    name: z.string(),
    department: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.USER.UPDATE]: z.object({
    userId: z.string(),
    updates: z.object({
      name: z.string().optional(),
      department: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }),
  }),

  [TOPICS.USER.DELETE]: z.object({
    userId: z.string(),
  }),

  // ML events
  [TOPICS.ML.PROCESS]: z.object({
    photoId: z.string(),
    modelType: z.enum(['ocr', 'image_processing']),
    parameters: z.record(z.unknown()).optional(),
  }),

  [TOPICS.ML.RESULT]: z.object({
    photoId: z.string(),
    modelType: z.enum(['ocr', 'image_processing']),
    results: z.record(z.unknown()),
    metadata: z.record(z.unknown()).optional(),
  }),

  [TOPICS.ML.ERROR]: z.object({
    photoId: z.string(),
    modelType: z.enum(['ocr', 'image_processing']),
    error: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),

  // Integration events
  [TOPICS.INTEGRATION.ERP.SYNC]: z.object({
    partNumber: z.string(),
    action: z.enum(['create', 'update', 'delete']),
    data: z.record(z.unknown()),
  }),

  [TOPICS.INTEGRATION.ERP.UPDATE]: z.object({
    partNumber: z.string(),
    updates: z.record(z.unknown()),
  }),

  [TOPICS.INTEGRATION.CAD.SYNC]: z.object({
    cadId: z.string(),
    action: z.enum(['create', 'update', 'delete']),
    data: z.record(z.unknown()),
  }),

  [TOPICS.INTEGRATION.CAD.UPDATE]: z.object({
    cadId: z.string(),
    updates: z.record(z.unknown()),
  }),
} as const;

// Type exports
export type PhotoUploadEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PHOTO.UPLOAD]>;
export type PhotoProcessEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PHOTO.PROCESS]>;
export type PhotoUpdateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PHOTO.UPDATE]>;
export type PhotoDeleteEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PHOTO.DELETE]>;

export type ThreadCreateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.THREAD.CREATE]>;
export type ThreadCommentEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.THREAD.COMMENT]>;
export type ThreadUpdateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.THREAD.UPDATE]>;
export type ThreadDeleteEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.THREAD.DELETE]>;

export type ProjectCreateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PROJECT.CREATE]>;
export type ProjectUpdateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PROJECT.UPDATE]>;
export type ProjectDeleteEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.PROJECT.DELETE]>;

export type UserCreateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.USER.CREATE]>;
export type UserUpdateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.USER.UPDATE]>;
export type UserDeleteEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.USER.DELETE]>;

export type MLProcessEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.ML.PROCESS]>;
export type MLResultEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.ML.RESULT]>;
export type MLErrorEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.ML.ERROR]>;

export type ERPSyncEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.INTEGRATION.ERP.SYNC]>;
export type ERPUpdateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.INTEGRATION.ERP.UPDATE]>;
export type CADSyncEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.INTEGRATION.CAD.SYNC]>;
export type CADUpdateEvent = z.infer<typeof EVENT_SCHEMAS[typeof TOPICS.INTEGRATION.CAD.UPDATE]>; 