export const imagesByFolderLight = `query ImagesByFolder(
  $folderId: ID
  $name: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
) {
  imagesByFolder(
    folderId: $folderId
    name: $name
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      key
      name
      isAnalyse
      online
    }
    nextToken
  }
}
`;

export const imagesByFolderExtraLight = `query ImagesByFolder(
  $folderId: ID
  $name: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
) {
  imagesByFolder(
    folderId: $folderId
    name: $name
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      online
    }
    nextToken
  }
}
`;