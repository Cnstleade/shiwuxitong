<template>
<div>
    <box  gap="10px 10px">
        <group label-width="8em"  title="请输入关键字和时间区间进行搜索">
            <x-input title="请输入关键字" placeholder="请输入关键字"  v-model="search.input" ></x-input>
            <datetime title="请选择开始时间" v-model="search.time1" value-text-align="left"></datetime>
            <datetime title="请选择结束时间" v-model="search.time2" value-text-align="left"></datetime>
        </group>
        <div style="padding:15px;">
           <x-button type="primary" @click.native="handleSearch">搜索</x-button>
        </div>
        <swipeout>
            <template v-for="(data,i) in tableData">
                <swipeout-item :key="i" @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
                  <div slot="right-menu">
                    <swipeout-button @click.native="onButtonClick('fav')" type="primary">详情</swipeout-button>
                    <swipeout-button @click.native="onButtonClick('delete')" type="warn">撤销</swipeout-button>
                  </div>
                  <div slot="content" class="demo-content">
                    <x-table>
                      <thead>
                        <tr>
                          <th style="width:20%">编号</th>
                          <th style="width:20%">接收人</th>
                          <th style="width:60%" >内容</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{data.id}}</td>
                          <td>{{data.receiverName}}</td>
                          <td >{{data.messageContent}}</td>
                        </tr>
                      </tbody>
                    </x-table>                      
                  <!-- {{data.id}} -->
                  </div>
                </swipeout-item>                   
            </template>
         
        </swipeout>
    </box>
</div>
</template>

<script>
import {
  XInput,
  Group,
  Divider,
  Datetime,
  XButton,
  Box,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  XTable
} from "vux";
import {
  httpGifCode,
  httpGetPeriodicMessage,
  httpSmsPeriodicMessage,
  httpDownload,
  httpSmsDetails,
  httpSmsDelete
} from "../../../service/http";
export default {
  components: {
    XInput,
    Group,
    Divider,
    Datetime,
    XButton,
    Box,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XTable
  },
  data() {
    return {
      title: "周期短信",
      search: {
        input: "",
        time1: "",
        time2: ""
      },
      tableData: [],
      loading: false,
      npage: 1,
      pagesize: 10,
      total: 0
    };
  },
  methods: {
    init(pageNumber, pageSize, keywords, startDate, endDate) {
      let _this = this;
      this.loading = true;
      httpGetPeriodicMessage(pageNumber, pageSize, keywords, startDate, endDate)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            _this.tableData = data.data.list;
            _this.total = data.data.total;
          } else if (data.code == 500) {
            this.$message.error(data.msg);
            this.$router.push("/login");
          } else {
            _this.$message.error(data.msg);
          }
          _this.loading = false;
        })
        .catch(err => {
          let data = err.response ? err.response.data : {};

          if (data.message == "当前登陆用户已失效，请重新登陆") {
            this.$message.error(data.message);
            this.$router.push("/login");
          } else {
            this.$message.error("网络错误请联系管理员");
          }
        });
    },
    handleSearch() {
      this.init(this.npage, this.pagesize);
    },
    onButtonClick() {},
    handleEvents(type) {
      console.log("event: ", type);
    }
  }
};
</script>

<style lang="less" scoped>
.demo-content {
  padding: 10px 0;
}
</style>

