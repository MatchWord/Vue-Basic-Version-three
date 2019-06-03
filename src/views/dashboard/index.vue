
<template>
  <el-container class="content">
    <div class="welcome">
      <div class="title" :style="{color: theme}">{{title}}</div>
      <!-- 模块快速导航 -->
      <div class="menu">
        <dashboard-menu-item :menuList="menuList"></dashboard-menu-item>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultSettings from "@/config/settings";
import DashboardMenuItem from './Components/DashboardMenuItem'

export default {
  name: 'Dashboard',
  data () {
    return {
      menuList: [],
      title: ''
    }
  },
  computed: {
    ...mapGetters(['theme', 'routes'])
    // routes() {
    //   return this.$router.options.routes; // 无用户权限
    // }
  },
  mounted () { 
    const { title } = defaultSettings;
    this.menuList = this.routes;
    this.title = title
  },
  methods: {
  },
  components: {
    DashboardMenuItem
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.content{
  .welcome{
    padding-top:50px;
    width:80%;
    margin:0 auto;
    .title {
      padding:10px 0;
      font-size:1.8rem;
      border-bottom: 1px solid $base-light-color;
    }
    .menu {
      width: 100%;
      padding-top:15px;
    }
  }
}
</style>
