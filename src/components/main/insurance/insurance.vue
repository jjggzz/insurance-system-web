<template>
    <el-container>
        <el-main>
            <el-form :inline="true" ref="form" :model="queryData" label-width="80px">
                <el-form-item label="保险名">
                    <el-input size="mini" v-model="queryData.insuranceName"></el-input>
                </el-form-item>
                <el-form-item label="保险类型">
                    <el-select size="mini" clearable v-model="queryData.insuranceType" placeholder="请选择类型">
                        <el-option
                                v-for="item in leixing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select size="mini" clearable v-model="queryData.status" placeholder="请选择状态">
                        <el-option label="未启用" value=0></el-option>
                        <el-option label="已启用" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="录入时间">
                    <el-col :span="11">
                        <el-date-picker size="mini" type="date" placeholder="选择日期" v-model="queryData.startTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker size="mini" placeholder="选择时间" v-model="queryData.endTime" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="getData()">查询</el-button>
                    <el-button v-if="this.checkAuthority([3])" size="mini" type="primary" @click="addInsuranceFormVisible = true">添加保险</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="responseList"
                    :default-sort = "{prop: 'inputTime', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="insuranceName"
                        label="保险名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="insuranceType"
                        label="保险类型"
                        width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.insuranceType === 0">意外险</span>
                        <span v-else-if="scope.row.insuranceType === 1">车险</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="金额">
                </el-table-column>
                <el-table-column
                        prop="inputUserName"
                        label="录入人">
                </el-table-column>
                <el-table-column
                        prop="inputTime"
                        label="录入时间">
                    <template slot-scope="scope">
                        {{scope.row.inputTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0">未启用</span>
                        <span v-else-if="scope.row.status === 1">已启用</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="accessKey"
                        label="文件">
                    <template slot-scope="scope">
                        <a :href="'/api/file/download/insurance/' + scope.row.accessKey" target="_blank">下载保险文件</a>
                    </template>
                </el-table-column>
                <el-table-column v-if="this.checkAuthority([3])" label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer >
            <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="6">
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="totalPage"
                            @prev-click="PageChange"
                            @next-click="PageChange"
                            @current-change="PageChange">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-footer>
        <el-dialog title="添加保险" :visible.sync="addInsuranceFormVisible">
            <el-form :model="addInsuranceFrom">
                <el-form-item label="保险名" label-width="120px">
                    <el-input size="mini" v-model="addInsuranceFrom.insuranceName" ></el-input>
                </el-form-item>
                <el-form-item label="保险金额" label-width="120px">
                    <el-input size="mini" type="number" v-model="addInsuranceFrom.money"></el-input>
                </el-form-item>
                <el-form-item label="保险类型" label-width="120px">
                    <el-select size="mini" v-model="addInsuranceFrom.insuranceType" placeholder="请选择角色">
                        <el-option
                                v-for="item in leixing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择文件" label-width="120px">
                    <el-upload
                            class="upload-demo"
                            action="/api/file/upload"
                            :on-success="onSuccess"
                            :limit="1"
                            :before-upload="checkUpload"
                            :before-remove="onRemove"
                            multiple>
                        <el-button size="small" type="primary" >点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addInsuranceFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addInsurance">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改保险" :visible.sync="updateInsuranceFormVisible">
            <el-form :model="updateInsuranceFrom">
                <el-form-item label="保险名" label-width="120px">
                    <el-input size="mini" v-model="updateInsuranceFrom.insuranceName" ></el-input>
                </el-form-item>
                <el-form-item label="保险金额" label-width="120px">
                    <el-input size="mini" type="number" v-model="updateInsuranceFrom.money"></el-input>
                </el-form-item>
                <el-form-item label="保险类型" label-width="120px">
                    <el-select size="mini" v-model="updateInsuranceFrom.insuranceType" placeholder="请选择角色">
                        <el-option
                                v-for="item in leixing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择文件" label-width="120px">
                    <el-upload
                            class="upload-demo"
                            action="/api/file/upload"
                            :on-success="onSuccess"
                            :limit="1"
                            :before-upload="checkUpload"
                            :before-remove="onRemove"
                            multiple>
                        <el-button size="small" type="primary" >点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传不超过500MB的文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateInsuranceFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateInsurance">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                leixing:[
                    {
                        key:0,
                        label:"意外险",
                        value:0
                    },
                    {
                        key:1,
                        label:"车险",
                        value:1
                    }
                ],
                updateInsuranceFrom:{
                    accessKey:null,
                    insuranceName:'',
                    money:null,
                    insuranceType:null,
                    filePath:''
                },
                filePath:'',
                uploads: false,
                addInsuranceFrom:{
                    insuranceName:'',
                    money:null,
                    insuranceType:null,
                    filePath:''
                },
                updateInsuranceFormVisible:false,
                addInsuranceFormVisible:false,
                queryData: {
                    insuranceName:'',
                    insuranceType:null,
                    status:null,
                    startTime:null,
                    endTime:null,
                    pageNum: 1,
                    pageSize: 10,
                },
                responseList:[],
                totalPage: 0
            };
        },
        created() {
            //初始化数据
            this.$axios.post("/insurance/list",this.queryData).then(response =>{
                const { data } = response;
                if (data.code !== 200) {
                    Message({
                        message: data.message || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                } else {
                    this.responseList = data.data.list;
                    this.totalPage = data.data.total;
                }
            });
        },
        methods:{
            onRemove() {
                this.uploads = false;
                return !this.uploads
            },
            checkUpload(){
              return !this.uploads
            },
            //文件上传成功
            onSuccess(response) {
                if (response.code !== 200) {
                    Message({
                        message: response.message || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                } else {
                    this.filePath = response.data;
                    this.uploads = true;
                }
            },
            // 修改保险
            updateInsurance() {
                this.updateInsuranceFrom.filePath = this.filePath;
                this.$axios.put("/insurance/update",this.updateInsuranceFrom).then(response => {
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.getData();
                        this.updateInsuranceFormVisible = false;
                        this.uploads = false;
                    }
                });
            },
            // 添加保险
            addInsurance(){
                this.addInsuranceFrom.filePath = this.filePath;
                this.$axios.post("/insurance/add",this.addInsuranceFrom).then(response => {
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.getData();
                        this.addInsuranceFormVisible = false;
                        this.addInsuranceFrom = {};
                        this.uploads = false;
                    }
                });
            },
            handleEdit(index, row) {
                this.updateInsuranceFrom = row;
                this.updateInsuranceFormVisible = true;
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该保险信息, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$axios.delete("/insurance/delete/" + row.accessKey).then(response => {
                        const { data } = response;
                        if (data.code !== 200) {
                            Message({
                                message: data.message || 'Error',
                                type: 'error',
                                duration: 5 * 1000
                            })
                        } else {
                            this.getData();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }

                    });
                });

            },
            PageChange(p) {
                this.queryData.pageNum = p;
                this.getData()
            },
            getData(){
                this.$axios.post("/insurance/list",this.queryData).then(response =>{
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.responseList = data.data.list;
                        this.totalPage = data.data.total;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>