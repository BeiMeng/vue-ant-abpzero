<!--
<template>
  <div style="margin: -23px -24px 24px -24px">
    &lt;!&ndash;<a-dropdown :trigger="['contextmenu']" overlayClassName="multi-tab-menu-wrapper">
      <a-menu slot="overlay">
        <a-menu-item key="1">1st menu item</a-menu-item>
        <a-menu-item key="2">2nd menu item</a-menu-item>
        <a-menu-item key="3">3rd menu item</a-menu-item>
      </a-menu>
    </a-dropdown>&ndash;&gt;
    <a-tabs
      hideAdd
      v-model="activeKey"
      type="editable-card"
      :tabBarStyle="{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }"
      @edit="onEdit"
    >
      <a-tab-pane v-for="page in pages" :style="{ height: 0 }" :tab="page.meta.title" :key="page.fullPath" :closable="pages.length > 1">
      </a-tab-pane>
      <template slot="renderTabBar" slot-scope="props, DefaultTabBar">
        <component :is="DefaultTabBar" {...props} />
      </template>
    </a-tabs>
  </div>
</template>
-->

<script>
export default {
  name: 'MultiTab',
  data () {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    }
  },
  created () {
    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.selectedLastPath()
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.fullPathList = this.fullPathList.filter(path => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath () {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },

    // content menu
    closeThat (e) {
      this.remove(e)
    },
    closeLeft (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex < (this.fullPathList.length - 1)) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeAll (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    refreshThat(e){
      //1.先只删除当前页面的缓存
      this.$store.dispatch('delCachedView', e).then(()=>{
          //2.改变路由地址为首页，以便重新加载路由时页眉会刷新,但如果当前页为首页，则首页无法刷新
          this.$router.push('/');
          this.$nextTick(() => {             
              this.$router.push(e.fullPath)  //3 再重新加载到此页,因为缓存已经清除了，路由也有变化，所以页面会重新加载                                         
          })                   
      })
    },
    closeMenuClick ({ key, item, domEvent }) {
      const vkey = domEvent.target.getAttribute('data-vkey')
      let pageObj=JSON.parse(vkey);
      switch (key) {
        case 'close-right':
          this.closeRight(pageObj.fullPath)
          break
        case 'close-left':
          this.closeLeft(pageObj.fullPath)
          break
        case 'close-all':
          this.closeAll(pageObj.fullPath)
          break
         case 'refresh-that':
          this.refreshThat(pageObj)
          break         
        default:
        case 'close-that':
          this.closeThat(pageObj.fullPath)
          break
      }
    },
    renderTabPaneMenu (e) {
      return (
        <a-menu {...{ on: { click: this.closeMenuClick } }}>
          <a-menu-item key="close-that" data-vkey={e}>关闭当前标签</a-menu-item>
          <a-menu-item key="close-right" data-vkey={e}>关闭右侧</a-menu-item>
          <a-menu-item key="close-left" data-vkey={e}>关闭左侧</a-menu-item>
          <a-menu-item key="close-all" data-vkey={e}>关闭全部</a-menu-item>
          <a-menu-item key="refresh-that" data-vkey={e}>刷新</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane (title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none',display:'inline-block',height:'100%' }}>{ title }</span>
        </a-dropdown>
      )
    },
    tabChange(val){
      this.$router.push({ path: val })
    },
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.fullPath
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath)
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    }
  },
  render () {
    const { onEdit, $data: { pages } } = this
    const panes = pages.map(page => {
      let newPg={
        fullPath:page.fullPath,
        name:page.name
      };
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.title, JSON.stringify(newPg))}
          key={page.fullPath} closable={pages.length > 1 && !page.meta.noClosable}
        >
        </a-tab-pane>)
    })

    return (
      <div class="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            on-change={this.tabChange}
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '10px' }}
            {...{ on: { edit: onEdit } }}>
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
