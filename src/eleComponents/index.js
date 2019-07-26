




import sPagination from './sPagination'

import crud from './crud'

let items=[
  sPagination,
  crud
]

let alias="";

let components = {
    install: function(instance) {
      Object.keys(items).forEach(key => {
        let name = `${alias}${items[key].name}`;
        instance.component(name, items[key]);
      });
    }
  };
Vue.use(components);