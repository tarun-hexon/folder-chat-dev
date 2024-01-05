import supabase from "./supabse";

export async function getUserId(fromTable, selectParam){
    try {
      let { data: users, error } = await supabase
      .from(fromTable)
      .select(selectParam);
      return users;
    } catch (error) {
      throw (error)
    }
  
};
export async function isUserExist(fromTable, selectParam, key, data){
    
    try {
      let { data: users, error } = await supabase
      .from(fromTable)
      .select(selectParam)
      .eq(key, data);
      
      if(error){
        throw error
      }
      return users
    } catch (error) {
      console.log(error)
    }
  
  }
export async function insertData(fromTable, data){
    try {
        const { error } = await supabase
    .from(fromTable)
    .insert(data);
    } catch (error) {
        throw error
    }
};

// export const { error } = await supabase
// .from('users')
// .insert({ 
//     name: name,
//     email:session?.user?.email,
//     email_verified:true
// })