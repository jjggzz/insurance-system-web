<template>
    <el-container>
        <el-header style="background-color: aliceblue">
            <el-form :inline="true" ref="form" :model="queryData" label-width="80px">
                <el-form-item label="保单名">
                    <el-input size="mini" v-model="queryData.policyName"></el-input>
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
                    <el-button v-if="this.checkAuthority([2,3])" size="mini" type="primary" @click="addPolicyFormVisible = true">添加保单</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table
                    :data="responseList"
                    :default-sort = "{prop: 'inputTime', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="policyName"
                        label="保单名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="insureUserName"
                        label="投保人"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="benefitUserName"
                        label="受益人">
                </el-table-column>
                <el-table-column
                        prop="insuranceName"
                        label="保险名">
                </el-table-column>
                <el-table-column
                        prop="inputTime"
                        label="录入时间">
                    <template slot-scope="scope">
                        {{scope.row.inputTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="duration"
                        label="时长/月">
                </el-table-column>
                <el-table-column
                        prop="accessKey"
                        label="文件">
                    <template slot-scope="scope">
                        <a :href="'/api/file/download/policy/' + scope.row.accessKey" target="_blank">下载保单文件</a>
                    </template>
                </el-table-column>
                <el-table-column v-if="this.checkAuthority([2,3])" label="操作">
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
        <el-dialog title="添加保单" :visible.sync="addPolicyFormVisible">
            <el-form :model="addPolicyFrom">
                <el-form-item label="保单名" label-width="120px">
                    <el-input size="mini" v-model="addPolicyFrom.policyName" ></el-input>
                </el-form-item>
                <el-form-item label="时长/月" label-width="120px">
                    <el-input size="mini" type="number" v-model="addPolicyFrom.duration" ></el-input>
                </el-form-item>
                <el-form-item label="投保人" label-width="120px">
                    <el-select v-model="addPolicyFrom.insureUserAccessKey" filterable placeholder="请选择">
                        <el-option
                                v-for="item in userData"
                                :key="item.accessKey"
                                :label="item.userName"
                                :value="item.accessKey">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="受益人" label-width="120px">
                    <el-select v-model="addPolicyFrom.benefitUserAccessKey" filterable placeholder="请选择">
                        <el-option
                                v-for="item in userData"
                                :key="item.accessKey"
                                :label="item.userName"
                                :value="item.accessKey">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保险名" label-width="120px">
                    <el-select v-model="addPolicyFrom.insuranceAccessKey" filterable placeholder="请选择">
                        <el-option
                                v-for="item in insuranceData"
                                :key="item.accessKey"
                                :label="item.insuranceName"
                                :value="item.accessKey">
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
                <el-button @click="addPolicyFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPolicy">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改保单" :visible.sync="updatePolicyFormVisible">
            <el-form :model="updatePolicyFrom">
                <el-form-item label="保单名" label-width="120px">
                    <el-input size="mini" v-model="updatePolicyFrom.policyName" ></el-input>
                </el-form-item>
                <el-form-item label="时长/月" label-width="120px">
                    <el-input size="mini" type="number" v-model="updatePolicyFrom.duration" ></el-input>
                </el-form-item>
                <el-form-item label="投保人" label-width="120px">
                    <el-select v-model="updatePolicyFrom.insureUserAccessKey" filterable placeholder="请选择">
                        <el-option
                                v-for="item in userData"
                                :key="item.accessKey"
                                :label="item.userName"
                                :value="item.accessKey">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="受益人" label-width="120px">
                    <el-select v-model="updatePolicyFrom.benefitUserAccessKey" filterable placeholder="请选择">
                        <el-option
                                v-for="item in userData"
                                :key="item.accessKey"
                                :label="item.userName"
                                :value="item.accessKey">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保险名" label-width="120px">
                    <el-select v-model="updatePolicyFrom.insuranceAccessKey" filterable placeholder="请选择">
                        <el-option
                                v-for="item in insuranceData"
                                :key="item.accessKey"
                                :label="item.insuranceName"
                                :value="item.accessKey">
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
                <el-button @click="updatePolicyFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePolicy">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                updatePolicyFrom:{
                    policyName:'',
                    duration:null,
                    insureUserAccessKey:null,
                    benefitUserAccessKey:null,
                    insuranceAccessKey:null,
                    filePath:''
                },
                addPolicyFrom:{
                    policyName:'',
                    duration:null,
                    insureUserAccessKey:null,
                    benefitUserAccessKey:null,
                    insuranceAccessKey:null,
                    filePath:''
                },
                filePath:'',
                uploads: false,
                updatePolicyFormVisible:false,
                addPolicyFormVisible:false,
                queryData: {
                    policyName:'',
                    startTime:null,
                    endTime:null,
                    pageNum: 1,
                    pageSize: 10,
                },
                responseList:[],
                totalPage: 0,
                insuranceData:[],
                userData:[],
            };
        },
        created() {
            //初始化数据
            this.$axios.post("/policy/list",this.queryData).then(response =>{
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
            this.$axios.get("/user/baseData").then(response =>{
                const { data } = response;
                if (data.code !== 200) {
                    Message({
                        message: data.message || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                } else {
                    this.userData = data.data;
                }
            });
            this.$axios.get("/insurance/baseData").then(response =>{
                const { data } = response;
                if (data.code !== 200) {
                    Message({
                        message: data.message || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                } else {
                    this.insuranceData = data.data;
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
            // 修改保单
            updatePolicy() {
                this.$axios.put("/policy/update",this.updatePolicyFrom).then(response => {
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.getData();
                        this.updatePolicyFormVisible = false;
                        this.uploads = false;
                    }
                });
            },
            // 添加保单
            addPolicy(){
                this.addPolicyFrom.filePath = this.filePath;
                this.$axios.post("/policy/add",this.addPolicyFrom).then(response => {
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.getData();
                        this.addPolicyFormVisible = false;
                        this.addPolicyFrom = {};
                        this.uploads = false;
                    }
                });
            },
            handleEdit(index, row) {
                this.updatePolicyFrom = row;
                this.updatePolicyFormVisible = true;
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该保单, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$axios.delete("/policy/delete/" + row.accessKey).then(response => {
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
                this.$axios.post("/policy/list",this.queryData).then(response =>{
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