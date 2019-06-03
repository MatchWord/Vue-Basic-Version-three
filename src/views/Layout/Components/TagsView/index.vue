<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <draggable v-model="visitedViews" :options="tabDragOptions">
        <transition-group>
          <!-- 动态改变主题颜色 -->
          <router-link
            v-for="tag in visitedViews"
            ref="tag"
            tag="span"
            :key="tag.path"
            :class="{'active' : isActive(tag), 'no-drag': tag.meta.affix }"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            class="tags-view-item"
            :style="{backgroundColor: isActive(tag) ? theme : '', borderColor: isActive(tag) ? theme : ''}"
            @click.middle.native="closeSelectedTag(tag)"
            @contextmenu.prevent.native="openMenu(tag,$event)"
          >
            {{ tag.title }}
            <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
          </router-link>
        </transition-group>
      </draggable>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新标签页</li>
      <hr class="line" />
      <li v-if="!(selectedTag.meta && selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">
        关闭标签页
      </li>
      <li @click="closeOthersTags">关闭其他标签页</li>
      <li @click="closeAllTags(selectedTag)">关闭所有标签页</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollPane from './Comp/ScrollPane'
import draggable from 'vuedraggable'
import path from 'path'

export default {
  components: { ScrollPane, draggable },
  data() {
    return {
      visible: false, // 鼠标右击事件显示元素
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [], // 默认标签
      tabDragOptions: {
        animation: 120,
        filter: '.no-drag'
      }
    }
  },
  computed: {
    ...mapGetters(['theme']),
    routes() {
      // return this.$router.options.routes; // 无用户权限
      return this.$store.getters.routes
    },
    // 访问视图
    visitedViews: {
      get () {
        return this.$store.state.tagsView.visitedViews
      },
      set (views) {
        this.$store.dispatch('tagsView/dragedViews', views)
      }
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    // 过滤路由表中有粘在tagsViews 上的tags
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    // 初始化标签
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    // 路由变化时 添加这路由到路由视图中
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    // 移除当前路由tag，更新路由表 
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    // 刷新选中路由
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        //选中路由不是当前路由
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: fullPath
          })
        })
      })
    },
    // 关闭选中路由
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        //选中路由为当前路由
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    // 关闭其他路由
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        // 移除当前路由tag，更新路由表 
        this.moveToCurrentTag()
      })
    },
    // 关闭所有路由
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        // if (this.affixTags.some(tag => tag.path === view.path)) {
        //   return
        // }
        this.toLastView(visitedViews, view)
      })
    },
    // 当前路由被删除，跳转到tags最后一个路由上
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === '首页') {
          // to reload home page
          this.$router.replace({ path: view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: $menuActiveText;
        color: #fff;
        border-color: $menuActiveText;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
    .line{
      border-color: #1890FF;
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>

