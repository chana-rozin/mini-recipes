import http from "./http";
import { storeRecipes, getStoredRecipes} from "./localStorage.ts";
import {isWithinLastFiveMinutes} from "../../utils/isWithinLastFiveMinutes";

export const getRecipes = async (selectedCategories:string[] = [], searchQuery:string = "", page = 0, pageSize=10): Promise<any>=>{
    const url = `/recipes?category=${selectedCategories.join(",")}&search=${searchQuery}&page=${page}&pageSize=${pageSize}`
    
    const storedRecipes = getStoredRecipes();
    
    if (storedRecipes && storedRecipes.url === url && isWithinLastFiveMinutes(storedRecipes.storedTime)) {
        console.log('get from local storage');
        return storedRecipes.data;
    }
    const response = await http.get(url);
    storeRecipes({recipes: response.data, url});
    console.log('get from server');
    return response.data;
}