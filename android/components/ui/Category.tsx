import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { TouchableOpacity, View, Text } from "react-native";

const Category = ({ name, icon, onPress }: { name: string, icon: string, onPress: () => void }) => (
    <>
        <TouchableOpacity
            className="items-center mr-6"
            onPress={() => onPress()}
        >
            <View className="items-center justify-center mb-2 bg-gray-200 rounded-full w-14 h-14">
                <MaterialIcons name={icon as any} size={24} color="black" />
            </View>
            <Text className="text-xs">{name}</Text>
        </TouchableOpacity>
    </>
)
export default Category;
