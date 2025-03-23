import { SignUpFormData,LoginFormData } from "@/types/auth_type";
import { axios_ins } from "./axios_ins"

export const CrudService = {
    getAll : (reqpath:string)=>{
        return axios_ins.get(`/${reqpath}`);
    },
    getById : (reqpath:string,id:string)=>{
        return axios_ins.get(`/${reqpath}/${id}`);
    },
    add : (reqpath:string,data: SignUpFormData | LoginFormData)=>{
        return axios_ins.post(`/${reqpath}`,data,{
            withCredentials : true
        });
    },
    update : (reqpath:string,data : SignUpFormData | LoginFormData)=>{
        return axios_ins.put(`/${reqpath}`,data);
    },
    updateById : (reqpath:string,id:string,data : SignUpFormData | LoginFormData)=>{
        return axios_ins.put(`/${reqpath}/${id}`,data);
    },
    delete : (reqpath:string)=>{
        return axios_ins.delete(`/${reqpath}`);
    },
    deleteById : (reqpath:string,id:string)=>{
        return axios_ins.delete(`/${reqpath}/${id}`);
    }
}