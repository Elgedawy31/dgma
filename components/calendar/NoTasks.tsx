import { View, Text, Image } from "react-native";
import React from "react";

const NoTasks = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
    <Image source={require('@/assets/images/no-tasks.png')} />

    <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" , textAlign:'center' }}>Empty</Text>
        <Text style={{ fontSize: 20, fontWeight: "400" , textAlign:'center' , color:'#515151'  , marginTop:6}}>No task added for this date</Text>

    </View>
    </View>
  );
};

export default NoTasks;
