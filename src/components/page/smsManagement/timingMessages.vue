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
                    <el-button  icon="el-icon-plus" type="primary" @click="dialogVisible1=true,resetForm('ruleForm3')" >新增</el-button>
            </el-col>
            <el-col :span="2" >
                  <el-button  type="danger" @click="download">下载模板</el-button>
            </el-col> 
            <el-col :span="4" >                            
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="123"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">上传格式为"txt"或"xsl"文件</div> -->
                  </el-upload>                
            </el-col>             
            <el-col :span="16"   class="col-flex-end">
                    <el-button  type="primary" @click="reset">重置</el-button>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.mobilePhone"
                          clearable>
                        </el-input> 
                    </div>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入关键字"
                          v-model="search.keywords"
                          clearable>
                        </el-input> 
                    </div>
                    <el-select class="l20" v-model="search.sendStatus" placeholder="状态">
                      <el-option
                        v-for="item in sendStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
                    <el-select class="l20" v-model="search.sendPlatform" placeholder="发送平台">
                      <el-option
                        v-for="item in sendPlatform"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                                                                            
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
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>        
        
            <el-table-column prop="id" label="序号" align="center" width="70"  sortable></el-table-column>

            <el-table-column prop="senddatetime" label="发送时间" align="center" width="140" ></el-table-column>
            <el-table-column prop="mobilePhone" label="电话" align="center" width="120" ></el-table-column>
            <el-table-column prop="sendStatus" label="状态" align="center" width="100" 
             :filters="[{ text: '已发送', value: '1' }, { text: '未发送', value: '2' }, { text: '发送失败', value: '3' }]" :filter-method="filterStatus" filter-placement="bottom-end"
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.sendStatus ===1?'success':scope.row.sendStatus ===2?'info':'danger'">
                          {{ scope.row.sendStatus ===1?'已发送':scope.row.sendStatus ===2?'未发送':'发送失败' }}
                        </el-tag>
                    </template> 
              
            </el-table-column>
            <el-table-column prop="reciverName" label="接收人姓名" align="center" width="100" ></el-table-column>
            <el-table-column prop="senderName" label="发送人" align="center" width="100" ></el-table-column>
            <el-table-column prop="senderName" label="备注" align="center" ></el-table-column>
            <el-table-column prop="sendPlatform" label="发送平台" align="center"  width="100" 
             :filters="[{ text: '华信', value: '1' }, { text: '创南', value: '2' }]" :filter-method="filterSendPlatform" filter-placement="bottom-end"
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.sendStatus ===1?'success':'danger'">
                          {{ scope.row.sendPlatform ===1?'华信':'创南' }}
                        </el-tag>
                    </template> 

            </el-table-column>
            <el-table-column prop="messageContent" label="消息内容" align="center" ></el-table-column>
            <el-table-column prop="messageType" label="短信类型" align="center" width="100"
             :filters="[{ text: '下款', value: '1' }, { text: '还款', value: '2' }, { text: '还本', value: '3' }]" :filter-method="filterMessageType" filter-placement="bottom-end"
                    >
                    <template slot-scope="scope">
                        <el-tag style="margin-left: 10px" :type="scope.row.messageType ===1?'success':scope.row.messageType===2?'info':'danger'">
                          {{ scope.row.messageType ===1?'下款':scope.row.messageType ===2?'还款':'还本' }}
                        </el-tag>
                    </template> 
              
            </el-table-column>
            <el-table-column prop="cz"  align="center" label="操作" width="200"  >
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
                   >编辑</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                   >撤销</el-button>                   
                </template> 
            </el-table-column>            
        </el-table>  
       <el-row class="m20" v-if="total>0">
            <el-button type="primary" style="float:left" @click="handelConfigAll" :disabled="multipleSelection.length==0">批量删除</el-button>
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
       <el-dialog
          title="新增短信"
          :visible.sync="dialogVisible1"
          center
          width="30%"
          >
            <el-form :rules="rules" :model="ruleForm3" status-icon  ref="ruleForm3" label-width="100px" >
              <!-- <el-form-item label="发送时间" >
                <el-input v-model="ruleForm3.username" ></el-input>
              </el-form-item> -->
              <el-form-item label="电话" prop='mobile'>
                <el-input v-model="ruleForm3.mobile"></el-input>
              </el-form-item>  
              <el-form-item label="立即发送">
                <el-switch v-model="ruleForm3.now"></el-switch>
              </el-form-item>   
              <el-form-item label="发送时间" v-if="!ruleForm3.now">
                <el-date-picker
                  v-model="ruleForm3.sendTime"
                  type="datetime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>                
              </el-form-item>  
              <!-- <el-form-item label="发送状态" prop="status" >
                    <el-select  v-model="ruleForm3.status" placeholder="发送状态">
                      <el-option
                        v-for="item in sendStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
              </el-form-item>                -->
              <el-form-item label="接收人姓名" prop="reciverName">
                <el-input v-model="ruleForm3.reciverName" ></el-input>
              </el-form-item>  
              <el-form-item label="发送人" prop="senderName">
                <el-input v-model="ruleForm3.senderName" ></el-input>
              </el-form-item>   
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm3.remarks"></el-input>
              </el-form-item>
              <el-form-item label="发送平台" prop="sendPlatform">
                    <el-select  v-model="ruleForm3.sendPlatform" placeholder="发送平台">
                      <el-option
                        v-for="item in sendPlatform"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
              </el-form-item>  
              <el-form-item label="消息内容">
                <el-input type="textarea" v-model="ruleForm3.messageContent"></el-input>
              </el-form-item>              
              <el-form-item label="短信类型" prop="messageType">
                    <el-select  v-model="ruleForm3.messageType" placeholder="短信类型">
                      <el-option
                        v-for="item in messageType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
              </el-form-item>                             
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm3')">提交</el-button>
                  <el-button @click="resetForm('ruleForm3')">重置</el-button>
                </el-form-item>
            </el-form>       
        </el-dialog>   
       <el-dialog
          title="编辑短信"
          :visible.sync="dialogVisible2"
          center
          width="30%"
          >
            <el-form :rules="rules" :model="ruleForm2" status-icon  ref="ruleForm2" label-width="100px" >
              <!-- <el-form-item label="发送时间" >
                <el-input v-model="ruleForm3.username" ></el-input>
              </el-form-item> -->
              <el-form-item label="电话" prop='mobilePhone'>
                <el-input v-model="ruleForm2.mobilePhone"></el-input>
              </el-form-item>  
              <el-form-item label="立即发送">
                <el-switch v-model="ruleForm2.now"></el-switch>
              </el-form-item>   
              <el-form-item label="发送时间" v-if="!ruleForm2.now">
                <el-date-picker
                  v-model="ruleForm2.senddatetime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>                
              </el-form-item>  
              <!-- <el-form-item label="发送状态" prop="sendStatus" >
                    <el-select  v-model="ruleForm2.sendStatus" placeholder="发送状态">
                      <el-option
                        v-for="item in sendStatus"
                        :key="item.value"
                        
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
              </el-form-item>                -->
              <el-form-item label="接收人姓名" prop="reciverName">
                <el-input v-model="ruleForm2.reciverName" ></el-input>
              </el-form-item>  
              <el-form-item label="发送人" prop="senderName">
                <el-input v-model="ruleForm2.senderName" ></el-input>
              </el-form-item>   
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm2.remarks"></el-input>
              </el-form-item>
              <el-form-item label="发送平台" prop="sendPlatform">
                    <el-select  v-model="ruleForm2.sendPlatform" placeholder="发送平台">
                      <el-option
                        v-for="item in sendPlatform"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
              </el-form-item>  
              <el-form-item label="消息内容">
                <el-input type="textarea" v-model="ruleForm2.messageContent"></el-input>
              </el-form-item>              
              <el-form-item label="短信类型" prop="messageType">
                    <el-select  v-model="ruleForm2.messageType" placeholder="短信类型">
                      <el-option
                        v-for="item in messageType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
              </el-form-item>                             
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                  <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>       
        </el-dialog>                                             
    </div>
</template>

<script>
import axios from "axios";
import { timeFormat } from "../../../config/time";
import {
  httpSelectTable,
  httpUpdateMessageAll,
  httpApmsgDeleteData
} from "../../../service/http";
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value != null && value != "") {
        var reg = /^[a-zA-Z0-9_-]{4,16}$/;
        if (!reg.test(value)) {
          return callback(
            new Error("请输入4-16位包含大小写字母和数字的用户名！")
          );
        } else {
          callback();
        }
      } else {
        return callback(
          new Error("请输入4-16位包含大小写字母和数字的用户名！")
        );
      }
    };

    var validatePassword = (rule, value, callback) => {
      if (value != null && value != "") {
        var reg = /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/g;
        if (!reg.test(value)) {
          return callback(
            new Error("密码必须由6-16个英文字母和数字的字符串组成！")
          );
        } else {
          callback();
        }
      } else {
        return callback(
          new Error("密码必须由6-16个英文字母和数字的字符串组成！")
        );
      }
    };

    var validateEmail = (rule, value, callback) => {
      if (value != null && value != "") {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(value)) {
          return callback(new Error("请输入正确邮箱！"));
        } else {
          callback();
        }
      } else {
        return callback(new Error("请输入正确邮箱！"));
      }
    };

    var validateMobile = (rule, value, callback) => {
      var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      console.log(value);
      if (value == "") {
        callback(new Error("请输入正确手机号码！"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确手机号码！"));
      } else {
        callback();
      }
    };
    return {
      title: "定时短信",
      multipleSelection: [],
      search: {
        time: [],
        keywords: ""
      },
      sendStatus: [
        { label: "已发送", value: 1 },
        { label: "未发送", value: 2 },
        { label: "发送失败", value: 3 }
      ],
      sendPlatform: [{ label: "华信", value: 1 }, { label: "创南", value: 2 }],
      messageType: [
        { label: "下款", value: 1 },
        { label: "还款", value: 2 },
        { label: "还本", value: 3 }
      ],
      dialogVisible1: false,
      fileList: [],
      tableData: [],
      loading: false,
      npage: 1,
      pagesize: 10,
      total: 0,
      dialogVisible2: false,
      ruleForm3: { now: false },
      ruleForm2: {},
      rules: {
        staffName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        reciverName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        senderName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        username: [
          { require: true, validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { require: true, validator: validatePassword, trigger: "blur" }
        ],
        mobilePhone: [
          { require: true, validator: validateMobile, trigger: "blur" }
        ],
        email: [{ require: true, validator: validateEmail, trigger: "blur" }],
        mobile: [{ require: true, validator: validateMobile, trigger: "blur" }],
        roles: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个角色",
            trigger: "change"
          }
        ],
        ssex: [{ required: true, message: "请选择性别", trigger: "change" }],
        deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
        sendStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        sendPlatform: [
          { required: true, message: "请选择发送平台", trigger: "change" }
        ],
        messageType: [
          { required: true, message: "请选择发送平台", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //新增修改用户
    _httpUpdateMessageAll(
      Id,
      senddatetime,
      mobilePhone,
      sendTime,
      sendStatus,
      reciverName,
      senderName,
      sendDate,
      remarks,
      sendPlatform,
      messageContent,
      messageType
    ) {
      httpUpdateMessageAll(
        Id,
        senddatetime,
        mobilePhone,
        sendTime,
        sendStatus,
        reciverName,
        senderName,
        sendDate,
        remarks,
        sendPlatform,
        messageContent,
        messageType
      )
        .then(res => {
          let data = res.data;
          if (data.status) {
            this.$message({
              message: data.messager,
              type: "success"
            });
            this.resetForm("ruleForm3");
            this.resetForm("ruleForm2");
            this.dialogVisible2 = false;
            this.dialogVisible1 = false;
            this.init(this.npage, this.pagesize);
          } else {
            this.$message.error(data.messager);
          }
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    init(
      pageNumber,
      pageSize,
      mobilePhone,
      sendStatus,
      messageContent,
      sendPlatform
    ) {
      let _this = this;
      this.loading = true;
      httpSelectTable(
        pageNumber,
        pageSize,
        mobilePhone,
        sendStatus,
        messageContent,
        sendPlatform
      )
        .then(res => {
          let data = res.data;

          _this.tableData = data.rows;
          console.log(JSON.stringify(_this.tableData));
          _this.total = data.total;

          _this.loading = false;
        })
        .catch(err => {
          _this.$message.error("网络错误");
          _this.loading = false;
        });
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
    beforeAvatarUpload(file) {
      //将文件 的所有的内容都添加在这一起上传
      let fd = new FormData();
      fd.append("upload", file);
      // fd.append("realMoney", Number(this.editForm.realMoney)); //其他参数
      // fd.append("withdrawId", Number(this.editForm.withdrawId)); //其他参数
      // fd.append("discountAmt", Number(this.editForm.discountAmt)); //其他参数
      // fd.append("mustPayBackAmt", Number(this.editForm.mustPayBackAmt)); //其他参数
      // fd.append("actualPayBackAmt", Number(this.editForm.actualPayBackAmt)); //其他参数
      // fd.append("remark", this.editForm.remark); //其他参数
      // console.log(fd);
      // const isJPG = /image\/\w+/.test(file.type);
      // const isLt2M = file.size / 1024 / 1024 < 4;

      // if (!isJPG) {
      //   this.$message.error("必须上传图片!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 4MB!");
      // }
      // return isJPG && isLt2M;
      console.log(file);
      var re = /\w+\.(txt|xlsx)/;
      const isJPG = re.test(file.name);
      console.log(isJPG);
      const isLt2M = file.size / 1024 / 1024 < 4;

      // if (!isJPG) {
      //   return this.$message.error("上传头像图片只能是 txt和xlsx格式!");
      // }
      if (!isLt2M) {
        return this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (!file) {
        return this.$message.error("请上传文本");
      }
      this.$message({
        message: "申请提交成功等待审核",
        type: "success"
      });
      axios.post("/readExcel", fd, {});
      return isJPG && isLt2M;
    },
    reset() {
      this.search = {};
      this.init(this.npage, this.pagesize);
    },
    handleSearch() {
      this.init(
        this.npage,
        this.pagesize,
        this.search.mobilePhone,
        this.search.sendStatus,
        this.search.keywords,
        this.search.sendPlatform
      );
    },
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch();
    },
    //提交更新修改
    onSubmit(formName) {
      if (formName == "ruleForm3") {
        if (this.ruleForm3.now) {
          this._httpUpdateMessageAll(
            null,
            timeFormat(new Date()),
            this.ruleForm3.mobile,
            null,
            this.ruleForm3.status,
            this.ruleForm3.reciverName,
            this.ruleForm3.senderName,
            null,
            this.ruleForm3.remarks,
            this.ruleForm3.sendPlatform,
            this.ruleForm3.messageContent,
            this.ruleForm3.messageType
          );
        } else {
          this._httpUpdateMessageAll(
            null,
            this.ruleForm3.sendTime,
            this.ruleForm3.mobile,
            null,
            this.ruleForm3.status,
            this.ruleForm3.reciverName,
            this.ruleForm3.senderName,
            null,
            this.ruleForm3.remarks,
            this.ruleForm3.sendPlatform,
            this.ruleForm3.messageContent,
            this.ruleForm3.messageType
          );
        }
      } else {
        if (this.ruleForm2.now) {
          this._httpUpdateMessageAll(
            this.ruleForm2.id,
            timeFormat(new Date()),
            this.ruleForm2.mobilePhone,
            null,
            null,
            this.ruleForm2.reciverName,
            this.ruleForm2.senderName,
            null,
            this.ruleForm2.remarks,
            this.ruleForm2.sendPlatform,
            this.ruleForm2.messageContent,
            this.ruleForm2.messageType
          );
        } else {
          this._httpUpdateMessageAll(
            this.ruleForm2.id,
            this.ruleForm2.senddatetime,
            this.ruleForm2.mobilePhone,
            null,
            null,
            this.ruleForm2.reciverName,
            this.ruleForm2.senderName,
            null,
            this.ruleForm2.remarks,
            this.ruleForm2.sendPlatform,
            this.ruleForm2.messageContent,
            this.ruleForm2.messageType
          );
        }
      }
    },
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.onSubmit(formName);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(index, row) {
      let id = row.id;
      let _this = this;
      this.ruleForm2 = Object.assign({}, row, { now: false });
      this.dialogVisible2 = true;
    },
    handleDelete(index, row) {
      let id = row.id;
      let _this = this;
      this.$confirm("此操作将永久撤销该短信, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this._httpApmsgDeleteData(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "网络错误已取消删除"
          });
        });
    },
    _httpApmsgDeleteData(ids) {
      let _this = this;
      httpApmsgDeleteData(ids)
        .then(res => {
          let data = res.data;
          if (data.status) {
            _this.$message({
              message: data.messager,
              type: "success"
            });
          } else {
            _this.$message.error(data.messager);
          }
        })
        .catch(err => {
          _this.$message.error("网络错误");
        });
    },
    //批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handelConfigAll() {
      let ids = [];
      let _this = this;
      for (let a = 0; a < this.multipleSelection.length; a++) {
        ids.push(this.multipleSelection[a].id);
      }
      this.$confirm("此操作将永久删除该短信, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this._httpApmsgDeleteData(ids.join(","));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "网络错误已取消删除"
          });
        });
    },
    filterStatus(value, row, column) {
      return row.sendStatus == value;
    },
    filterSendPlatform(value, row, column) {
      return row.sendPlatform == value;
    },
    filterMessageType(value, row, column) {
      return row.messageType == value;
    },
    //download
    download() {}
  },
  mounted() {
    this.init(this.npage, this.pagesize);
  }
};
</script>

<style>
</style>
