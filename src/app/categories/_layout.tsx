import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import {Ionicons} from '@expo/vector-icons'


const CategoryLayout = () => {
  return (
   <Stack> 
    <Stack.Screen name='[slug]' options={({navigation})=>({headerShown:false,
                                           /*  create a f for go back */
                                          headerLeft:()=>  (    
                                          
                                          <TouchableOpacity onPress={()=>navigation.goBack()}>
                                            <Ionicons name='arrow-back' size={24} color='black' />
              
                                          </TouchableOpacity>   )                  

                                           })} 
    
    />   


   </Stack>
  )
}

export default CategoryLayout

const styles = StyleSheet.create({})