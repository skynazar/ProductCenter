import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    department: String!
    role: String!
  }

  type Photo {
    id: ID!
    fileName: String!
    s3Url: String!
    uploadedAt: String!
    annotations: [Annotation!]!
    project: Project
  }

  type Annotation {
    id: ID!
    type: String!
    coordinates: JSON!
    label: String
    photo: Photo!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    content: String!
    createdAt: String!
    user: User!
  }

  type Project {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    photos: [Photo!]!
  }

  type ERPData {
    partNumber: String!
    description: String!
    revision: String!
    status: String!
    metadata: JSON!
  }

  type CADData {
    id: ID!
    name: String!
    type: String!
    version: String!
    viewerUrl: String!
    metadata: JSON!
  }

  type Query {
    photos(limit: Int): [Photo!]!
    photo(id: ID!): Photo
    projects(limit: Int): [Project!]!
    project(id: ID!): Project
    erpData(partNumber: String!): ERPData
    cadData(id: ID!): CADData
  }

  type Mutation {
    uploadPhoto(file: Upload!, projectId: ID): Photo!
    createProject(name: String!, description: String): Project!
    addComment(annotationId: ID!, content: String!): Comment!
  }

  scalar JSON
  scalar Upload
`; 