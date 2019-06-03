<template>
  <div>
    <template v-for="item in routes">
      <template v-if="!item.hidden">
        <!-- no children -->
        <template
          v-if="
            item.children.length === 1 &&
              !item.children[0].children &&
              !item.alwaysShow
          "
        >
          <el-menu-item
            :index="item.path + '/' + item.children[0].path"
            :key="item.path + '/' + item.children[0].path"
          >
            <i class="svg-icon" :class="item.children[0].meta.icon"></i>
            <span slot="title">{{ item.children[0].meta.title }}</span>
          </el-menu-item>
        </template>
        <!-- have children -->
        <el-submenu v-else :index="item.name || item.path" :key="item.name">
          <template slot="title">
            <i
              class="svg-icon"
              v-if="item.meta.icon"
              :class="item.meta.icon"
            ></i>
            <span slot="title" v-if="item.meta.title">{{
              item.meta.title
            }}</span>
          </template>
          <template v-for="child in item.children">
            <template v-if="!child.hidden">
              <sidebar-item
                v-if="child.children && child.children.length > 0"
                :is-nest="true"
                :routes="[child]"
                :key="child.path"
              >
              </sidebar-item>
              <template v-else>
                <el-menu-item
                  :index="item.path + '/' + child.path"
                  :key="item.path + '/' + child.path"
                >
                  <i
                    class="svg-icon"
                    v-if="child.meta.icon"
                    :class="child.meta.icon"
                  ></i>
                  <span slot="title" v-if="child.meta.title">{{
                    child.meta.title
                  }}</span>
                </el-menu-item>
              </template>
            </template>
          </template>
        </el-submenu>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    routes: Array,
    isNest: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // console.log(this.routes);
  }
};
</script>
<style lang="scss" scoped>
.svg-icon {
  padding: 0px 10px 0px 5px;
}
</style>
