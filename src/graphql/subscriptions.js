/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateImage = `subscription OnCreateImage($folderId: ID) {
  onCreateImage(folderId: $folderId) {
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
export const onUpdateImage = `subscription OnUpdateImage($folderId: ID) {
  onUpdateImage(folderId: $folderId) {
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
export const onDeleteImage = `subscription OnDeleteImage($folderId: ID) {
  onDeleteImage(folderId: $folderId) {
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
export const onCreateFolder = `subscription OnCreateFolder($owner: String) {
  onCreateFolder(owner: $owner) {
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
export const onUpdateFolder = `subscription OnUpdateFolder($owner: String) {
  onUpdateFolder(owner: $owner) {
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
export const onDeleteFolder = `subscription OnDeleteFolder {
  onDeleteFolder {
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
export const onCreateMatch = `subscription OnCreateMatch($owner: String) {
  onCreateMatch(owner: $owner) {
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
export const onUpdateMatch = `subscription OnUpdateMatch($owner: String) {
  onUpdateMatch(owner: $owner) {
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
export const onDeleteMatch = `subscription OnDeleteMatch($owner: String) {
  onDeleteMatch(owner: $owner) {
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
