import http from "./http";
import { storeRecipes, getStoredRecipes} from "./localStorage.ts";
import {isWithinLastFiveMinutes} from "./utils/isWithinLastFiveMinutes.ts";

export const getRecipes = async (selectedCategories:string[] = [], searchQuery:string = "", page = 0, pageSize=10): Promise<any>=>{
    const url = `/recipes?category=${selectedCategories.join(",")}&search=${searchQuery}&page=${page}&pageSize=${pageSize}`

    const storedRecipes = getStoredRecipes();
    
    if (storedRecipes && storedRecipes.url === url && isWithinLastFiveMinutes(storedRecipes.storedTime)) {
        return storedRecipes.data;
    }
    const response = await http.get(url);
    storeRecipes({recipes: response.data, url});
    return response.data;
}