/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPayment = `query GetPayment($id: ID!) {
  getPayment(id: $id) {
    id
    date
    stripePaymentIntent
    amount
    user
  }
}
`;
export const listPayments = `query ListPayments(
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      date
      stripePaymentIntent
      amount
      user
    }
    nextToken
  }
}
`;
export const getPlan = `query GetPlan($id: ID!) {
  getPlan(id: $id) {
    id
    paymentId
    folderId
    maxUpload
    usedUpload
    createDate
    endDate
    user
  }
}
`;
export const listPlans = `query ListPlans(
  $id: ID
  $filter: ModelPlanFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPlans(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      paymentId
      folderId
      maxUpload
      usedUpload
      createDate
      endDate
      user
    }
    nextToken
  }
}
`;
export const getFolder = `query GetFolder($id: ID!) {
  getFolder(id: $id) {
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
export const listFolders = `query ListFolders(
  $id: ID
  $filter: ModelFolderFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listFolders(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      owner
      planId
      title
      online
      created
      publicKey
      lastRegex
    }
    nextToken
  }
}
`;
export const getImage = `query GetImage($key: ID!) {
  getImage(key: $key) {
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
export const listImages = `query ListImages(
  $key: ID
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listImages(
    key: $key
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      key
      folderId
      name
      isAnalyse
      analysisResult
      online
      date
      owner
    }
    nextToken
  }
}
`;
export const getMatch = `query GetMatch($id: ID!) {
  getMatch(id: $id) {
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
export const listMatchs = `query ListMatchs(
  $id: ID
  $filter: ModelMatchFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listMatchs(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      folderId
      key
      name
      match
      online
      date
      owner
    }
    nextToken
  }
}
`;
export const planByFolder = `query PlanByFolder(
  $folderId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  planByFolder(
    folderId: $folderId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      paymentId
      folderId
      maxUpload
      usedUpload
      createDate
      endDate
      user
    }
    nextToken
  }
}
`;
export const folderByOwner = `query FolderByOwner(
  $owner: ID
  $created: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelFolderFilterInput
  $limit: Int
  $nextToken: String
) {
  folderByOwner(
    owner: $owner
    created: $created
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      owner
      planId
      title
      online
      created
      publicKey
      lastRegex
    }
    nextToken
  }
}
`;
export const imagesByFolder = `query ImagesByFolder(
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
      folderId
      name
      isAnalyse
      analysisResult
      online
      date
      owner
    }
    nextToken
  }
}
`;
export const matchByImageKey = `query MatchByImageKey(
  $key: ID
  $date: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMatchFilterInput
  $limit: Int
  $nextToken: String
) {
  matchByImageKey(
    key: $key
    date: $date
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      folderId
      key
      name
      match
      online
      date
      owner
    }
    nextToken
  }
}
`;
export const imagesByMatch = `query ImagesByMatch(
  $folderId: ID
  $onlineMatchNameDate: ModelMatchByMatchCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMatchFilterInput
  $limit: Int
  $nextToken: String
) {
  imagesByMatch(
    folderId: $folderId
    onlineMatchNameDate: $onlineMatchNameDate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      folderId
      key
      name
      match
      online
      date
      owner
    }
    nextToken
  }
}
`;
