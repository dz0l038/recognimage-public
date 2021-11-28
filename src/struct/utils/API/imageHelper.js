// DB
import { API, graphqlOperation } from "aws-amplify";
import * as queries from '../../../graphql/queries';
import * as customQueries from '../../../graphql/custom/queries';
import GeneralHelpers from "../Helpers/GeneralHelpers";

class ImageHelper {
    static getImageByFolderId(folderId, nextToken = null, perpage = 200) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(customQueries.imagesByFolderLight, { folderId: folderId, limit: perpage, sortDirection: "ASC", nextToken: nextToken }))
                .then(result => {
                    let items = GeneralHelpers.checkNested(result, "data", "imagesByFolder", "items");
                    let nextToken = GeneralHelpers.checkNested(result, "data", "imagesByFolder", "nextToken");
                    if (items && items.length > 0) {
                        resolve([items, nextToken])
                    } else {
                        resolve([[], null])
                    }
                })
                .catch(err => {
                    console.log(err)
                    resolve([[], null])
                });
        })
    }

    static getImageWithAnaliticByFolderId(folderId, nextToken = null, perpage = 200) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(queries.imagesByFolder, { folderId: folderId, limit: perpage, sortDirection: "ASC", nextToken: nextToken }))
                .then(result => {
                    let items = GeneralHelpers.checkNested(result, "data", "imagesByFolder", "items");
                    let nextToken = GeneralHelpers.checkNested(result, "data", "imagesByFolder", "nextToken");
                    if (items && items.length > 0) {
                        resolve([items, nextToken])
                    } else {
                        resolve([[], null])
                    }
                })
                .catch(err => {
                    console.log(err)
                    resolve([[], null])
                });
        })
    }

    static getImageCountOnePageByFolderId(folderId, nextToken) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(customQueries.imagesByFolderExtraLight, { folderId: folderId, nextToken: nextToken, limit: 1000}))
                .then(result => {
                    let items = GeneralHelpers.checkNested(result, "data", "imagesByFolder", "items");
                    let nextTokenReceived = GeneralHelpers.checkNested(result, "data", "imagesByFolder", "nextToken");
                    if (items && items.length > 0) {
                        resolve([items.length, nextTokenReceived])
                    } else {
                        resolve([0, null])
                    }
                })
                .catch(err => {
                    console.log(err)
                    resolve(null)
                });
        })
    }

    static async getImageCountByFolderId(folderId) {
        return new Promise(async (resolve, reject) => {
            let nextToken = null;
            let first = true;
            let totalLength = 0;
            while (nextToken || first) {
                first = false;
                let length = 0;
                [length, nextToken] = await this.getImageCountOnePageByFolderId(folderId, nextToken)
                totalLength = totalLength + length;
            }
            resolve(totalLength)
        })
    }

    static getPublicImageByFolderId(folderId, search, nextToken = null, perpage = 50) {
        const apiName = "publicapi"
        const apiEndpoint = "/images"
        const body = {
            folderId: folderId,
            nextToken: nextToken,
            search: search,
            perpage: perpage,
        }
        return new Promise(async (resolve, reject) => {
            API.post(apiName, apiEndpoint, { body })
                .then(result => {
                    if (result && result.body) {
                        resolve(result.body)
                    } else {
                        resolve([])
                    }
                })
                .catch(err => {
                    console.log(err)
                    resolve([])
                });
        })
    }
}

export default ImageHelper;