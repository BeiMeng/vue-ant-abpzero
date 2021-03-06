
function Find(name,json) {
    var findChild = function (levelObj, children) {
      for (let index = 0; index < children.length; index++) {
          const element = children[index];
          handle.push({
              name: element.name,
              levelObj: levelObj
          });
          if (element["children"] != null && element.children.length > 0) {
              var tmpLevel = levelObj.idLevel + element.name + ',';
              var tmpPath = levelObj.pathLevel + element.path + ',';
              findChild({
                  idLevel: tmpLevel,
                  pathLevel: tmpPath
              }, element.children);
          }
      }
    }



    var eachData = json;
    var handle = [{
        name: json.name,
        levelObj: {
            idLevel: ',' + json.name + ',',
            pathLevel: ',' + json.path + ','
        }
    }];
    if (eachData["children"] != null && eachData.children.length > 0) {
        findChild({
            idLevel: ',' + eachData.name + ',',
            pathLevel: ',' + eachData.path + ','
        }, eachData.children);
    }
    for (let index = 0; index < handle.length; index++) {
        const element = handle[index];
        if (element.name == name) {
            return {
                names: element.levelObj.idLevel.substr(1, element.levelObj.idLevel.lastIndexOf(",") - 1).split(","),
                paths: element.levelObj.pathLevel.substr(1, element.levelObj.pathLevel.lastIndexOf(",") - 1).split(",")
            };
        }
    }
    return null;
  }




import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted () {
    this.updateMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange (openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }      
      let openKeys = []
      if (this.mode === 'inline') {
        // routes.forEach(item => {
        //   openKeys.push(item.path)
        // })
        let menus=this.$store.state.permission.menus;
        let route=menus.filter(p=>p.path=='/');
        if(route.length==0){
          console.error('路由定义错误,未按照约定规则定义！');
        }
        let menuRouters=route[0];

        let d=Find(this.$route.name,menuRouters);
        openKeys=d.paths;
      }

      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },

    // render
    renderItem (menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem (menu) {
      const target = menu.meta.target || null
      const tag = target && 'a' || 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: menu.path, target: menu.meta.target }

      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }

      return (
        <Item {...{ key: this.getFixPath(menu) }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </tag>
        </Item>
      )
    },
    renderSubMenu (menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      return (
        <SubMenu {...{ key: this.getFixPath(menu) }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        <Icon {... { props } }/>
      )
    },
    //add 2020/5/9 BeiDream：修复隐藏子菜单点击tab无法定位到相应左侧菜单问题
    getFixPath(menu){
      if(menu.hideChildrenInMenu){
        return menu.redirect
      }else{
        return menu.path
      }
    }
  },

  render () {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    // {...{ props, on: on }}
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
