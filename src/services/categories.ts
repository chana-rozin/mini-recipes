import http from './http'

export const getCategories = async ()=>{
    const res = await http.get("/categories");
    return res.data;
}

export const postCategory = async ( newCategory: string)=>{
    const res = await http.post("/categories", { name: newCategory });
    return res.data;
}