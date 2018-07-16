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
                          placeholder="请输入关键字"
                          v-model="search.input"
                          clearable>
                        </el-input> 
                    </div>   
                    <el-select class="l20" v-model="search.sendPlatform" placeholder="发送平台">
                      <el-option
                        v-for="item in sendPlatform"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                                                      
                    <!-- <el-date-picker
                    style="width:340px"
                    class="l20"
                      v-model="search.time"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>  -->
    <el-date-picker
    class="l20"
      v-model="search.time"
         value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择日期">
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
 <el-table-column prop="id" label="编号" align="center" sortable></el-table-column>
            <el-table-column prop="messageContent" label="发送内容" align="center" ></el-table-column>
            <el-table-column prop="sendPlatform" label="发送平台" align="center" 
             :filters="[{ text: '华信', value: '1' }, { text: '创南', value: '2' }]" :filter-method="filterSendPlatform" filter-placement="bottom-end"
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.sendStatus ===1?'success':'danger'">
                          {{ scope.row.sendPlatform ===1?'华信':'创南' }}
                        </el-tag>
                    </template> 

            </el-table-column> 
            <el-table-column prop="sendDate" label="发送时间" align="center" sortable></el-table-column>
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
import { httpSelectMarketingMsg } from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
  data() {
    return {
      title: "营销短信",
      search: {
        input: "",
        sendPlatform: "",
        time: ""
      },
      tableData: [],
      sendPlatform: [{ label: "华信", value: 2 }, { label: "创南", value: 1 }],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      multipleSelection: [] //全部选中嘛
    };
  },
  methods: {
    getData(pageNumber, pageSize, messageContent, sendPlatform, sendDate, Id) {
      let _this = this;
      this.loading = true;
      httpSelectMarketingMsg(
        pageNumber,
        pageSize,
        messageContent,
        sendPlatform,
        sendDate,
        Id
      )
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
      this.getData(
        this.npage,
        this.pagesize,
        this.search.input,
        this.search.sendPlatform,
        this.search.time
      );
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
      this.search = {
        input: "",
        sendPlatform: "",
        time: ""
      };
      this.getData(
        this.npage,
        this.pagesize,
        this.search.input,
        this.search.sendPlatform
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    filterSendPlatform(value, row, column) {
      return row.sendPlatform == value;
    }
  },
  mounted() {
    this.getData(
      this.npage,
      this.pagesize,
      this.search.input,
      this.search.sendPlatform
    );
  }
};
</script>

<style>
</style>

