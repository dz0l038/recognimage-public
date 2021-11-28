// DB
import { API, graphqlOperation } from "aws-amplify";
import * as queries from '../../../graphql/queries';
import GeneralHelpers from "../Helpers/GeneralHelpers";

class PlanHelper {
    static getPlanById(id) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(queries.getPlan, { id: id }))
                .then(result => {
                    let res = GeneralHelpers.checkNested(result, "data", "getPlan");
                    resolve(res)
                })
                .catch(err => {
                    console.log(err)
                    resolve(null)
                });
        })
    }
    static getPlanByFolderId(id) {
        return new Promise(async (resolve, reject) => {
            API.graphql(graphqlOperation(queries.planByFolder, { folderId: id }))
                .then(result => {
                    let items = GeneralHelpers.checkNested(result, "data", "planByFolder", 'items');
                    if (items.length > 0) {
                        resolve(items[0])
                    } else {
                        resolve(null)
                    }
                })
                .catch(err => {
                    console.log(err)
                    resolve(null)
                });
        })
    }
}

export default PlanHelper;