<template>
  <!-- 动态绑定class名 -->
  <div :class="classObj" class="app-wrapper">
    <!-- 左侧的菜单栏 -->
    <sidebar class="sidebar-container" v-if="showNavMenu" />
    <!-- 右侧头部和内容 -->
    <div :class="{hasTagsView:tagsView}" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="tagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings" >
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
/** 
 * 当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。
为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键：
或者在computed中用下列方式取出带有命名空间的store存储的全局数据
sidebar() {
  return this.$store.state.app.sidebar;
},
*/
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapGetters } from "vuex";
// 右侧设置面板
import RightPanel from '@/components/RightPanel'
// 引入左侧的菜单栏
import sidebar from "./Components/Sidebar";
// 引入Navbar 头部
import Navbar from "./Components/Navbar";
// 引入主体内容
import AppMain from "./Components/Appmain";
// 引入TagsView
import TagsView from "./Components/TagsView"
// 引入settings
import settings from "./Components/Settings"

export default {
  name: "Layout",
  components: { sidebar, Navbar, AppMain, TagsView, RightPanel, settings },
  computed: {
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapGetters(["sidebar", "device", "fixedHeader", "tagsView", "showSettings", "showNavMenu"]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        hideNavMenu: !this.showNavMenu
      };
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
// 菜单展开的样式 openSidebar (默认样式)
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidth;
    background-color: $menuBg;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  .main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: $sideBarWidth;
    position: relative;
    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: calc(100% - #{$sideBarWidth});
      transition: width 0.28s;
    }
  }
}
// 菜单隐藏的样式 hideSidebar
.hideSidebar {
  .sidebar-container {
    width: $sideBarHideWidth !important;
  }
  .main-container {
    margin-left: $sideBarHideWidth;
    .fixed-header {
      width: calc(100% - #{$sideBarHideWidth});
    }
  }
}
// 不显示左侧菜单
.hideNavMenu{
  .main-container {
    margin-left: 0px;
    .fixed-header {
      width: 100%;
    }
  }
}
</style>
