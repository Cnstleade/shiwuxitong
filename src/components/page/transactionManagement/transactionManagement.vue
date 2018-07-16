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
            <el-col :span="2">
                    <el-button  icon="el-icon-plus" type="primary" @click="dialogVisible1=true">新增</el-button>
            </el-col>            
            <el-col :span="22"   class="col-flex-end">
                    <el-button  type="primary" @click="reset">重置</el-button>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="事务名称"
                          v-model="search.input"
                          clearable>
                        </el-input> 
                    </div>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入关键字"
                          v-model="search.input"
                          clearable>
                        </el-input> 
                    </div>
                    <el-select class="l20" v-model="search.order" placeholder="事务类型">
                      <el-option
                        v-for="item in search.orders"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>   
                    <el-date-picker
                      v-model="search.time1"
                       value-format="yyyy-MM-dd"
                      style="width:160px"
                    class="l20"
                      type="date"
                      placeholder="创建时间">
                    </el-date-picker> 
                    <el-date-picker
                      v-model="search.time2"
                       value-format="yyyy-MM-dd"
                      style="width:160px"
                    class="l20"
                      type="date"
                      placeholder="待办时间">
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
          >
            <!-- <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>         -->
        
            <el-table-column prop="creatName" label="创建人" align="center"   ></el-table-column>
            <el-table-column prop="commissionName" label="待办人" align="center"   ></el-table-column>
            <el-table-column prop="name" label="事务名称" align="center"   ></el-table-column>
            <el-table-column prop="commissionAddres" label="待办地址" align="center"   ></el-table-column>
            <el-table-column prop="mobile" label="提醒人号码" align="center"   ></el-table-column>
            <el-table-column prop="commissionTime" label="待办时间" align="center"   ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"   ></el-table-column> 
            <el-table-column prop="sendTime" label="事务提醒时间" align="center"   ></el-table-column> 
            <el-table-column prop="status" label="状态" align="center" width="100" 
             :filters="[{ text: '新建', value: '1' }, { text: '未完成', value: '2' }, { text: '已完成', value: '3' }, { text: '过期未完成', value: '4' }]" :filter-method="filterStatus" filter-placement="bottom-end"
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.status ==1?'':scope.row.status ==2?'info':scope.row.status ==3?'success':'danger'">
                          {{ scope.row.status ==1?'新建':scope.row.status ==2?'未完成':scope.row.status ==3?'已完成':'过期未完成' }}
                        </el-tag>
                    </template> 
              
            </el-table-column>  
            <el-table-column prop="stop" label="是否结束" align="center" width="80" 
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.status ?'succes':'danger'">
                          {{ scope.row.status ?'是':'否' }}
                        </el-tag>
                    </template> 
              
            </el-table-column>     
            <el-table-column prop="type" label="类型" align="center" width="100" 
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.type ==1?'':scope.row.type ==2?'success':'danger'">
                          {{ scope.row.type ==1?'周':scope.row.type ==2?'月':'非周期' }}
                        </el-tag>
                    </template> 
              
            </el-table-column>                                  
            <el-table-column prop="cz"  align="center" label="操作" width="250"  >
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
                   >编辑</el-button>
                <el-button
                    size="mini"
                    type="success"
                    @click="handleShow(scope.$index, scope.row)"
                   >事务日志</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleTrue(scope.$index, scope.row)"
                   >完成</el-button>                                      
                </template> 
            </el-table-column>            
        </el-table>          
        <el-row class="m20" v-if="total>0">
            <!-- <el-button type="primary" style="float:left" @click="handelConfigAll" :disabled="multipleSelection.length==0">批量分配</el-button> -->
             <div style="float:right">
                 <el-pagination
                   @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                   :current-page="npage"
                    :page-sizes="[10, 20, 30, 40]"
                     :page-size="pageSize"
                   background
                   layout="total,sizes,prev, pager, next,jumper"
                   :total="total">
                 </el-pagination>   
             </div>
        </el-row>        
        <el-dialog
          title="新增事务"
          :visible.sync="dialogVisible1"
          center
          width="30%"
          >
            <el-form :model="ruleForm2" status-icon  ref="ruleForm2" label-width="100px" >
              <el-form-item label="事务名称">
                <el-input v-model="ruleForm2.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="待办人">
                <el-select v-model="ruleForm2.username" placeholder="请选择活动区域">
                    <el-option
                       v-for="item in jbr"
                       :key="item.id"
                       :label="item.staffName"
                       :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="代办时间">
                <el-col :span="11">
                  <el-date-picker type="date" 
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" 
                  v-model="ruleForm2.date1" 
                  style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="提醒时间">
                <el-col :span="11">
                    <el-time-picker
                      v-model="ruleForm2.date2"
                      style="width: 100%;"
                      placeholder="提醒时间">
                    </el-time-picker>                    
                </el-col>
              </el-form-item>              
              <!-- <el-form-item label="提醒人电话">
                <el-input v-model="ruleForm2.phone"></el-input>
              </el-form-item> -->
              <el-form-item label="活动性质">
                <el-select v-model="ruleForm2.type" placeholder="类型">
                    <el-option
                       v-for="item in hdxz"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm2.desc"></el-input>
              </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit1">提交</el-button>
                  <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>       
        </el-dialog>
        <el-dialog
          title="编辑事务"
          :visible.sync="dialogVisible2"
          center
          width="30%"
          >
            <el-form :model="ruleForm3" status-icon  ref="ruleForm3" label-width="100px" >
              <el-form-item label="事务名称">
                <el-input v-model="ruleForm3.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="待办人">
                <el-select v-model="ruleForm3.commissionUserId" placeholder="请选择活动区域">
                    <el-option
                       v-for="item in jbr"
                       :key="item.id"
                       :label="item.staffName"
                       :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="待办时间">
                <el-col :span="11">
                  <el-date-picker type="date"  value-format="yyyy-MM-dd" placeholder="选择日期" v-model="ruleForm3.date1" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="提醒时间">
                <el-col :span="11">
                    <el-time-picker
                      v-model="ruleForm3.sendTime"
                      style="width: 100%;"
                      placeholder="提醒时间">
                    </el-time-picker>                    
                </el-col>
              </el-form-item>              
              <!-- <el-form-item label="提醒人电话">
                <el-input v-model="ruleForm3.mobile"></el-input>
              </el-form-item> -->
            <el-form-item label="是否结束">
              <el-switch v-model="ruleForm3.stop"></el-switch>
            </el-form-item>              
            <el-form-item label="活动性质">
              <el-select v-model="ruleForm3.type" placeholder="类型">
                    <el-option
                       v-for="item in hdxz"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm3.desc"></el-input>
              </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit2">提交</el-button>
                  <el-button @click="resetForm('ruleForm3')">重置</el-button>
                </el-form-item>
            </el-form>       
        </el-dialog>   
        <el-dialog
          title="事务日志"
          :visible.sync="dialogVisible3"
          center
          width="60%"
          >
            <el-table
                :data="reportData"  
                border  
                tooltip-effect="dark"
                style="width: 100%"
                class="m20"
              >
                <el-table-column prop="affairName" label="事务名称" align="center"   ></el-table-column>
                <el-table-column prop="transatorName" label="办理人姓名" align="center"   ></el-table-column>
                <el-table-column prop="transatorTime" label="办理时间" align="center"   ></el-table-column>
                <el-table-column prop="discription" label="办理描述" align="center"   ></el-table-column>
                <el-table-column prop="money" label="金额" align="center"   ></el-table-column>
                <el-table-column prop="creatTime" label="更新时间" align="center"   ></el-table-column>
            </el-table>      
        </el-dialog>  
        <el-dialog
          title="事务完成信息"
          :visible.sync="dialogVisible4"
          center
          width="30%"
          >
            <el-form :model="ruleForm4" status-icon  ref="ruleForm3" label-width="100px" >
              <el-form-item label="事务名称">
                <el-input v-model="ruleForm3.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="待办人">
                <el-select v-model="ruleForm3.username" placeholder="请选择活动区域">
                    <el-option
                       v-for="item in jbr"
                       :key="item.id"
                       :label="item.staffName"
                       :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="待办时间">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm3.date1" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm3.desc"></el-input>
              </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">提交</el-button>
                  <el-button @click="resetForm('ruleForm3')">重置</el-button>
                </el-form-item>
            </el-form>       
        </el-dialog>                                                   
    </div>
</template>

<script>
import axios from "axios";
import {
  httpSelectAffairTable,
  httpUserNamelist,
  httpSelectAffairLogging,
  httpInsertAffairLogging,
  httpInsertAffair,
  httpUpdateAffair
} from "../../../service/http";
import { timeFormat, sFormat } from "../../../config/time";
export default {
  data() {
    return {
      id: "",
      title: "事务管理",
      search: {},
      tableData: [],
      commissionName: [], //
      creatName: [],
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      fileList: [],
      npage: 1,
      pageSize: 20,
      total: 0,
      multipleSelection: [], //全选框
      ruleForm2: {
        name: "",
        username: "",
        date1: "",
        date2: "",
        phone: "",
        type: "",
        desc: "",
        stop: false
      },
      jbr: [],
      hdxz: [
        { label: "非周期", value: "1" },
        { label: "周", value: "2" },
        { label: "月", value: "3" }
      ],
      ruleForm3: {},
      reportData: [{ affairName: 1 }],
      reporNpage: 0,
      reporPageSize: 5,
      reportTotal: 0,
      ruleForm4: {}
    };
  },
  methods: {
    //新增修改用户
    _httpInsertAffair(
      id,
      name,
      commissionUser,
      commissionUserId,
      commissionTime,
      sendTime,
      type,
      stop,
      commissionAddres
    ) {
      console.log("+++++++++++++");
      httpInsertAffair(
        id,
        name,
        commissionUser,
        commissionUserId,
        commissionTime,
        sendTime,
        type,
        stop,
        commissionAddres
      )
        .then(res => {
          let data = res.data;
          if (data.status == 200) {
            this.$message({
              message: data.messager,
              type: "success"
            });
            console.log(data);
            this.resetForm("ruleForm2");
            this.dialogVisible2 = false;
            this.dialogVisible1 = false;
            this.init(this.npage, this.pagesize);
          } else {
            this.$message.error(data.messager);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("网络错误请联系管理员");
        });
    },
    //新增修改用户
    _httpUpdateAffair(
      id,
      name,
      commissionUser,
      commissionUserId,
      commissionTime,
      sendTime,
      type,
      stop,
      commissionAddres
    ) {
      console.log("+++++++++++++");
      httpUpdateAffair(
        id,
        name,
        commissionUser,
        commissionUserId,
        commissionTime,
        sendTime,
        type,
        stop,
        commissionAddres
      )
        .then(res => {
          let data = res.data;
          if (data.status == 200) {
            this.$message({
              message: data.messager,
              type: "success"
            });
            console.log(data);
            this.resetForm("ruleForm2");
            this.dialogVisible2 = false;
            this.dialogVisible1 = false;
            this.init(this.npage, this.pagesize);
          } else {
            this.$message.error(data.messager);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("网络错误请联系管理员");
        });
    },
    init(pageNum, pageSize, name, type, creatTime, commissionTime) {
      let _this = this;
      httpSelectAffairTable(
        pageNum,
        pageSize,
        name,
        type,
        creatTime,
        commissionTime
      )
        .then(res => {
          let data = res.data;
          _this.tableData = data.rows;
          for (let a = 0; a < _this.tableData.length; a++) {
            _this.tableData[a].commissionName = data.commissionName[a];
            _this.tableData[a].creatName = data.creatName[a];
          }

          _this.total = data.total;
        })
        .catch();
    },
    //得到代办人
    _httpUserNamelist() {
      let _this = this;
      httpUserNamelist()
        .then(res => {
          let data = res.data;
          _this.jbr = data;
        })
        .catch();
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    reset() {
      this.search = {};
    },
    handleSearch() {
      console.log(this.search);
    },
    onSubmit() {
      console.log("submit!");
    },
    onSubmit1() {
      let _this = this;
      this.$refs["ruleForm2"].validate(valid => {
        if (valid) {
          _this._httpInsertAffair(
            "",
            _this.ruleForm2.name,
            _this.ruleForm2.username,
            _this.ruleForm2.username,
            _this.ruleForm2.date1,
            sFormat(_this.ruleForm2.date2),
            _this.ruleForm2.type,
            0,
            _this.ruleForm2.desc
          );
        } else {
          return false;
        }
      });
    },
    onSubmit2() {
      let _this = this;

      _this._httpUpdateAffair(
        this.id,
        _this.ruleForm3.name,
        _this.ruleForm3.username,
        _this.ruleForm3.username,
        _this.ruleForm3.date1,
        sFormat(_this.ruleForm3.sendTime),
        _this.ruleForm3.type,
        _this.ruleForm3.stop ? 0 : 1,
        _this.ruleForm3.desc
      );
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      formName = {};
    },
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(JSON.stringify(row));
      this.ruleForm3 = JSON.parse(JSON.stringify(row));
      this.id = row.id;
      this.dialogVisible2 = true;
    },
    //得到日志
    _httpSelectAffairLogging(affairId, pageNum, pageSize) {
      let _this = this;
        httpSelectAffairLogging(affairId, pageNum, pageSize)
          .then(res => {
            let data = res.data;
            _this.reportData = data.rows;
            _this.reportTotal = data.total;
          })
          .catch();
    },
    //展示日志
    handleShow(index, row) {
      let affairId = row.id;
      this._httpSelectAffairLogging(
        row.id,
        this.reporNpage,
        this.reporPageSize
      );
      this.dialogVisible3 = true;
    },
    //完成事务
    handleTrue(index, row) {
      this.dialogVisible4 = true;
    },
    //提交完成
    _httpInsertAffairLogging(
      affairId,
      transatorId,
      affairName,
      transatorName,
      money,
      discription
    ) {
      httpInsertAffairLogging(
        affairId,
        transatorId,
        affairName,
        transatorName,
        money,
        discription
      )
        .then(res => {
          let data = res.data;
          if (data) {
            this.$message({
              message: "完成提交成功",
              type: "success"
            });
          }
        })
        .catch();
    },
    filterStatus(value, row, column) {
      return row.Status == value;
    }
  },
  mounted() {
    this.init(this.npage - 1, this.pageSize);
    this._httpUserNamelist();
  }
};
</script>

<style>
</style>
