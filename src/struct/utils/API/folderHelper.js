// DB
import { API, graphqlOperation } from "aws-amplify";
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';

import GeneralHelpers from "../Helpers/GeneralHelpers";

class FolderHelper {
    static getMyFolder() {
        return new Promise(async (resolve, reject) => {
            let userSub = await GeneralHelpers.getCurrentUserSub();
            API.graphql(graphqlOperation(queries.folderByOwner, { owner: userSub, limit: "5000", sortDirection: "DESC" }))
                .then(result => {
                    let items = GeneralHelpers.checkNested(result, "data", "folderByOwner", "items");
                    if (items.length > 0) {
                        resolve(items)
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

    static getFolderById(id) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(queries.getFolder, { id: id }))
                .then(result => {
                    let res = GeneralHelpers.checkNested(result, "data", "getFolder");
                    resolve(res)
                })
                .catch(err => {
                    console.log(err)
                    resolve(null)
                });
        })
    }

    static updateLastRegexFolder(folderId, lastRegexString) {
        return new Promise(async (resolve, reject) => {
            let input = {
                id: folderId,
                lastRegex: lastRegexString,
            }

            API.graphql(graphqlOperation(mutations.updateFolder, { input: input }))
                .then(result => {
                    let lastRegex = GeneralHelpers.checkNested(result, "data", "updateFolder", "lastRegex");
                    resolve(lastRegex)
                })
                .catch(err => {
                    console.log(err)
                    resolve(null)
                });
        })
    }
}

export default FolderHelper;