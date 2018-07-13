<template>
    <div class="container">
        <el-row>
            <el-alert
              :title="title"
              :closable="false"
              type="info">
            </el-alert>           
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
                 <el-table-column prop="id" label="编号" align="center" width="80" sortable>
   
            </el-table-column>
            <el-table-column prop="username" label="操作用户" align="center" width="160"  sortable>
   
            </el-table-column>
            <el-table-column prop="operation" label="描述" align="center"  >
   
            </el-table-column>
            <el-table-column prop="time" label="耗时（毫秒）" align="center" width="120" sortable>
   
            </el-table-column>
            <el-table-column prop="method" label="操作方法" align="center"  width="400">
   
            </el-table-column>
            <el-table-column prop="ip" label="登陆IP地址" align="center" width="140"  >
   
            </el-table-column>   
            <el-table-column prop="createTime" label="操作时间" align="center" width="180" sortable>
   
            </el-table-column>                                                            
            

                <!-- <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >分配</el-button>
                    </template> 
                </el-table-column>             -->
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
import { httpLogList } from "../../../service/http";
export default {
  data() {
    return {
      title: "日志列表",
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
    getData(pageNum, pageSize) {
      let _this = this;
      httpLogList(pageNum, pageSize)
        .then(res => {
          let data = res.data;
          _this.tableData = data.rows;
          _this.total = data.total;
          _this.loading = false;
        })
        .catch(err => {
          _this.tableData = [];
          _this.loading = false;
        });
    },
    handleSearch() {
      this.getData(this.npage, this.pagesize);
    },
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
    this.getData(this.npage, this.pagesize);
  }
};
</script>

<style>
</style>
