/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFolder = `mutation CreateFolder($input: CreateFolderInput!) {
  createFolder(input: $input) {
    id
    owner
    planId
    title
    online
    created
    publicKey
    lastRegex
  }
}
`;
export const updateFolder = `mutation UpdateFolder($input: UpdateFolderInput!) {
  updateFolder(input: $input) {
    id
    owner
    planId
    title
    online
    created
    publicKey
    lastRegex
  }
}
`;
export const deleteFolder = `mutation DeleteFolder($input: DeleteFolderInput!) {
  deleteFolder(input: $input) {
    id
    owner
    planId
    title
    online
    created
    publicKey
    lastRegex
  }
}
`;
export const createImage = `mutation CreateImage($input: CreateImageInput!) {
  createImage(input: $input) {
    key
    folderId
    name
    isAnalyse
    analysisResult
    online
    date
    owner
  }
}
`;
export const updateImage = `mutation UpdateImage($input: UpdateImageInput!) {
  updateImage(input: $input) {
    key
    folderId
    name
    isAnalyse
    analysisResult
    online
    date
    owner
  }
}
`;
export const deleteImage = `mutation DeleteImage($input: DeleteImageInput!) {
  deleteImage(input: $input) {
    key
    folderId
    name
    isAnalyse
    analysisResult
    online
    date
    owner
  }
}
`;
export const createMatch = `mutation CreateMatch($input: CreateMatchInput!) {
  createMatch(input: $input) {
    id
    folderId
    key
    name
    match
    online
    date
    owner
  }
}
`;
export const updateMatch = `mutation UpdateMatch($input: UpdateMatchInput!) {
  updateMatch(input: $input) {
    id
    folderId
    key
    name
    match
    online
    date
    owner
  }
}
`;
export const deleteMatch = `mutation DeleteMatch($input: DeleteMatchInput!) {
  deleteMatch(input: $input) {
    id
    folderId
    key
    name
    match
    online
    date
    owner
  }
}
`;
