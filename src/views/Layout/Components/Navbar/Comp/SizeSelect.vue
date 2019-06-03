<template>
  <el-dropdown trigger="click" :size="size" @command="handleSetSize">
    <div>
      <span class="iconfont icon-wenzi"></span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions"
      :key="item.value"
      :disabled="size===item.value" 
      :command="item.value">
        {{item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  watch: {
    size (newVal, oldVal) {
      
    }
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
      this.$message({
        message: '切换文本大小成功,请刷新页面',
        type: 'success'
      })
    },
    // 改变文本大小，删除所有缓存视图
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)
      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path:  fullPath
        })
      })
    }
  }

}
</script>
