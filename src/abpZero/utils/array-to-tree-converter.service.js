
import * as _ from 'lodash';

let ArrayToTreeConverterService =  class ArrayToTreeConverterService {

    createTree(array, parentIdProperty, idProperty, parentIdValue, childrenProperty,warp=false,mappingList=[]){
        let tree = [];

        let nodes = _.filter(array, [parentIdProperty, parentIdValue]);

        _.forEach(nodes, node => {
            let d=new Object();
            d=_.cloneDeep(node);
            if(mappingList.length>0){
                for (let index = 0; index < mappingList.length; index++) {
                    const element = mappingList[index];
                    d[element[0]]=d[element[1]];
                }
            }
            if(warp){               
                let newNode = {
                    data: d
                };


                newNode[childrenProperty] = this.createTree(
                    array,
                    parentIdProperty,
                    idProperty,
                    d[idProperty],
                    childrenProperty,
                    warp,
                    mappingList
                );

                tree.push(newNode);
            }else{

                d[childrenProperty] = this.createTree(
                    array,
                    parentIdProperty,
                    idProperty,
                    d[idProperty],
                    childrenProperty,
                    warp,
                    mappingList
                );
                tree.push(d);  
            }
        });

        return tree;
    }
}
export {ArrayToTreeConverterService};
