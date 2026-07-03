const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const generateRecipeAPI = async(ingredients) =>{

    const response = await fetch(`${BASE_URL}/recipe/generate`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({ingredients})
    })
    if(!response.ok){
        throw new Error("Failed to generate recipe")
    }

    return response.json()
}