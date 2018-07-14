<template>
    <div class="container">
        <el-row>
            <el-alert
              :title="title"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>  
        <el-row class="m20" >
            <el-col   class="col-flex-end">
                    <!-- <el-button-group>
                      <el-button :type="execeedtimeType==0?'info':''" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button :type="execeedtimeType==1?'primary':''" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button :type="execeedtimeType==2?'success':''" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button :type="execeedtimeType==3?'warning':''" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button :type="execeedtimeType==4?'danger':''" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>     -->
                    <el-button  type="primary" @click="reset">重置</el-button>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.input"
                          clearable>
                        </el-input> 
                    </div>                                  
                    <el-date-picker
                    style="width:340px"
                    class="l20"
                      v-model="search.time"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>                
                    <el-button @click="handleSearch" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
            </el-col>             
        </el-row> 
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
            style="width: 100%"
            class="m20"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            id="eleTable"
          >
       
            <el-table-column prop="messageContent" label="消息内容" align="center" ></el-table-column>
                <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >分配</el-button>
                    </template> 
                </el-table-column>            
        </el-table>     
        <el-row class="m20" v-if="total>0">
             <div style="float:right">
                 <el-pagination
                   @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                   :current-page="npage"
                    :page-sizes="[10, 20, 30, 40]"
                     :page-size="pagesize"
                   background
                   layout="total,sizes,prev, pager, next,jumper"
                   :total="total">
                 </el-pagination>   
             </div>
        </el-row>                               
    </div>
</template>

<script>
import { httpSelectMarketingMsg } from "../../../service/http";
export default {
  data() {
    return {
      title: "营销短信",
      search: {
        input: "",
        time: ""
      },
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      multipleSelection: [] //全部选中嘛
    };
  },
  methods: {
    getData() {
      let _this = this;
      httpSelectMarketingMsg()
        .then(res => {
          let data = res.data;
        })
        .catch(err => {
          _this.tableData = [];
          _this.loading = false;
        });
    },
    handleSearch() {},
    handleAllocation(index, row) {},
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch();
    },
    reset() {
      this.search = null;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
</style>

