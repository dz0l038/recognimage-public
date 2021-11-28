// DB
import { API, graphqlOperation } from "aws-amplify";
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import GeneralHelpers from "../Helpers/GeneralHelpers";
import uuid from "react-uuid";

class MatchHelper {
    static getImagesByMatch(folderId, match, nextToken=null, perpage=300) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(queries.imagesByMatch, {
                folderId: folderId,
                onlineMatchNameDate: { beginsWith: { online: 'public', match: match } },
                limit: perpage,
                sortDirection: "ASC",
                nextToken: nextToken,
            }))
                .then(result => {
                    let items = GeneralHelpers.checkNested(result, "data", "imagesByMatch", "items");
                    let nextToken = GeneralHelpers.checkNested(result, "data", "imagesByMatch", "nextToken");
                    if (items.length > 0) {
                        resolve([items, nextToken])
                    } else {
                        resolve([[], nextToken])
                    }
                })
                .catch(err => {
                    console.log(err)
                    resolve([])
                });
        })
    }

    static getMatchesByFolderId(folderId, nextToken=null) {
        return this.getImagesByMatch(folderId, '', nextToken)
    }

    static deleteAllMatchesByFolderId(folderId) {
        return new Promise(async (resolve, reject) => {
            let nextToken = await this.deleteOnePageMatchesByFolderId(folderId)
            while (nextToken) {
                nextToken = await this.deleteOnePageMatchesByFolderId(folderId, nextToken);
            }
            resolve(true)
        })
    }

    static deleteOnePageMatchesByFolderId(folderId, nextToken=null) {
        return new Promise(async (resolve, reject) => {
            let matches = [];
            [matches, nextToken] = await this.getMatchesByFolderId(folderId, nextToken)
            let listDelete = [];

            for (let i = 0; i < matches.length; i++) {
                let didDelete = this.deleteMatch(matches[i].id);
                listDelete.push(didDelete)
            }
            await Promise.all(listDelete)
            resolve(nextToken)
        })
    }

    static deleteMatch(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let deleteMatch = await API.graphql(graphqlOperation(mutations.deleteMatch, { input: { id: id } }))
                if (GeneralHelpers.checkNested(deleteMatch, 'data', 'deleteMatch', 'id')) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (e) {
                console.log(e)
                resolve(false)
            }
        })
    }

    static createMatch(folderId, imageKey, name, match, online, date, owner) {
        return new Promise((resolve, reject) => {
            let input = {
                id: uuid(),
                folderId: folderId,
                key: imageKey,
                name: name,
                match: match,
                online: online,
                date: date,
                owner: owner,
            }
            API.graphql(graphqlOperation(mutations.createMatch, { input: input }))
                .then(result => {
                    let match = GeneralHelpers.checkNested(result, "data", "createMatch");
                    resolve(match)
                })
                .catch(err => {
                    console.log(err)
                    resolve(null)
                });
        })
    }
}

export default MatchHelper;