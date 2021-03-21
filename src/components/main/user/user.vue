<template>
    <el-container>
        <el-header style="background-color: aliceblue">
            <el-form :inline="true" ref="form" :model="queryData" label-width="80px">
                <el-form-item label="用户名">
                    <el-input size="mini" v-model="queryData.userName"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select size="mini" clearable v-model="queryData.rule" placeholder="请选择角色">
                        <el-option
                                v-for="item in leixing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
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
                    <el-button v-if="this.checkAuthority([3])" size="mini" type="primary" @click="addUserFormVisible = true">添加用户</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table
                    :data="responseList"
                    :default-sort = "{prop: 'inputTime', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        prop="userName"
                        label="用户名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="loginName"
                        label="登陆名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话号码">
                </el-table-column>
                <el-table-column
                        prop="inputTime"
                        label="录入时间">
                    <template slot-scope="scope">
                        {{scope.row.inputTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="identityNumber"
                        label="身份证号">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址">
                </el-table-column>
                <el-table-column
                        prop="age"
                        label="年龄">
                </el-table-column>
                <el-table-column
                        prop="rule"
                        label="角色">
                    <template slot-scope="scope">
                        <span v-if="scope.row.rule === 0">投保人</span>
                        <span v-else-if="scope.row.rule === 1">受益人</span>
                        <span v-else-if="scope.row.rule === 2">销售员</span>
                        <span v-else-if="scope.row.rule === 3">管理员</span>
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
        <el-dialog title="添加用户" :visible.sync="addUserFormVisible">
            <el-form :model="addUserFrom">
                <el-form-item label="用户名" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.userName" ></el-input>
                </el-form-item>
                <el-form-item label="登陆名" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.loginName" ></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.password" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.phone" ></el-input>
                </el-form-item>
                <el-form-item label="角色" label-width="120px">
                    <el-select size="mini" v-model="addUserFrom.rule" placeholder="请选择角色">
                        <el-option
                                v-for="item in leixing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份证号码" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.identityNumber"></el-input>
                </el-form-item>
                <el-form-item label="住址" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.address" ></el-input>
                </el-form-item>
                <el-form-item label="年龄" label-width="120px">
                    <el-input size="mini" v-model="addUserFrom.age" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="updateUserFormVisible">
            <el-form :model="updateUserFrom">
                <el-form-item label="用户名" label-width="120px">
                    <el-input size="mini" v-model="updateUserFrom.userName" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码" label-width="120px">
                    <el-input size="mini" v-model="updateUserFrom.phone" ></el-input>
                </el-form-item>
                <el-form-item label="角色" label-width="120px">
                    <el-select size="mini" v-model="updateUserFrom.rule" placeholder="请选择角色">
                        <el-option
                                v-for="item in leixing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份证号码" label-width="120px">
                    <el-input size="mini" v-model="updateUserFrom.identityNumber"></el-input>
                </el-form-item>
                <el-form-item label="住址" label-width="120px">
                    <el-input size="mini" v-model="updateUserFrom.address" ></el-input>
                </el-form-item>
                <el-form-item label="年龄" label-width="120px">
                    <el-input size="mini" v-model="updateUserFrom.age" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateUserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUser">确 定</el-button>
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
                        label:"投保人",
                        value:0
                    },
                    {
                        key:1,
                        label:"受益人",
                        value:1
                    },
                    {
                        key:2,
                        label:"销售员",
                        value:2
                    },
                    {
                        key:3,
                        label:"管理员",
                        value:3
                    }
                ],
                updateUserFrom:{
                    accessKey:null,
                    userName:'',
                    password:'',
                    phone:'',
                    rule:null,
                    identityNumber:'',
                    address:'',
                    age:null,
                },
                addUserFrom:{
                    userName:'',
                    loginName:'',
                    password:'',
                    phone:'',
                    rule:null,
                    identityNumber:'',
                    address:'',
                    age:null,
                },
                updateUserFormVisible:false,
                addUserFormVisible:false,
                queryData: {
                    userName:'',
                    rule:null,
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
            this.$axios.post("/user/list",this.queryData).then(response =>{
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
            // 修改用户
            updateUser() {
                this.$axios.put("/user/update",this.updateUserFrom).then(response => {
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.getData();
                        this.updateUserFormVisible = false
                    }
                });
            },
            // 添加用户
            addUser(){
                this.$axios.post("/user/add",this.addUserFrom).then(response => {
                    const { data } = response;
                    if (data.code !== 200) {
                        Message({
                            message: data.message || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
                    } else {
                        this.getData();
                        this.addUserFormVisible = false;
                        this.addUserFrom = {};
                    }
                });
            },
            handleEdit(index, row) {
                this.updateUserFrom = row;
                this.updateUserFormVisible = true;
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$axios.delete("/user/delete/" + row.accessKey).then(response => {
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
                this.$axios.post("/user/list",this.queryData).then(response =>{
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