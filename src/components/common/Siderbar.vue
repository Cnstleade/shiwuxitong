<template>
    <div class="sidebar" id="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.children">
                    <el-submenu :index="item.url" :key="item.id">
                        <template slot="title">
                            <i class="iconfont" :class="item.icon"></i><span slot="title">{{ item.text }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.url">
                            <i :class="subItem.icon"></i><span slot="title">{{subItem.text}}</span>
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.id" :key="item.id">
                        <i class="iconfont" :class="item.icon"></i><span slot="title">{{ item.text }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../../config/bus";
import { httpGetUserMenu } from "../../service/http";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "icon-gongzuotai",
          nurl: "smsManagement",
          mname: "短信管理",
          list: [
            {
              nurl: "cycleShortMessage",
              mname: "周期短信"
            },
            {
              nurl: "marketingMessages",
              mname: "营销短信"
            },
            {
              nurl: "timingMessages",
              mname: "定时短信"
            }
          ]
        },
        {
          icon: "icon-yonhu",
          nurl: "transactionManagement",
          mname: "事务管理",
          list: [
            {
              nurl: "transactionManagement",
              mname: "事务管理"
            }
          ]
        },
        {
          icon: "icon-zuanshi",
          nurl: "systemManagement",
          mname: "系统管理",
          list: [
            {
              nurl: "userManagement",
              mname: "用户管理"
            },
            {
              nurl: "managementLog",
              mname: "日志管理"
            },
            {
              nurl: "authorityManagement",
              mname: "权限管理"
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    init() {
      let username = localStorage.getItem("hsjr_username");
      let _this = this;
      httpGetUserMenu(username)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            _this.items = data.data.children;
          }
          console.log(_this.items);
        })
        .catch();
    },
    getHttpGetCreditMenuList() {
      let _this = this;
    }
  },
  mounted() {
    // this.getHttpGetCreditMenuList();
    this.init();
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>
<style>
#sidebar .el-submenu__title,
.el-menu-item {
  font-size: 12px;
  height: 36px;
  line-height: 36px;
}
#sidebar .el-submenu .el-menu-item {
  font-size: 12px;
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
  min-width: 160px;
}
#sidebar .el-upload--text {
  height: 36px;
}
</style>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 185px;
}
.sidebar > ul {
  height: 100%;
}

.iconfont {
  margin-right: 5px;
}
</style>

