import { StatusBar, StyleSheet, View, Platform, Animated, PanResponder, TextInput, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { Colors } from '../../constants/Colors'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/utils';
import FontAwesomIcon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

import {
    Text,
} from 'react-native-paper';
import { TripsData } from '../../data/expense/Expense';
import FlexStyles from '../../assets/Styles/FlexStyles';
import { Friends } from '../../data/friends/Friends';
import woman from '../../assets/images/commonImage/woman.png'
import men from '../../assets/images/commonImage/men.png'
import { filter } from 'lodash'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { CreateGroup, GetUserGroupList } from '../../store/thunks/ExpenseDetailthunk';

const bottomSheetMaxHeight = WINDOW_HEIGHT * 0.6
const bottomSheetMinHeight = WINDOW_HEIGHT * 0.3
const maxUpwardTranslateY = bottomSheetMinHeight - bottomSheetMaxHeight //negative no
const maxDownwordTranslateY = 0
const dragThreshold = 50
const BottomSheet = ({ onClose, setSelectedTrip }) => {
    const navigation = useNavigation();

    const animatedValue = useRef(new Animated.Value(0)).current;
    const lastGestureDy = useRef(0);
    const [searchQuery, setsearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [tripsData, setTripsData] = useState([])
    const [fullData, setFullData] = useState(TripsData)
    const dispatch = useDispatch()
    const onCross = () => {
        onClose()
    }
    const registerCTX = useSelector((state) => state.register);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                console.log('grant', lastGestureDy.current);
                animatedValue.setOffset(lastGestureDy.current)
            },
            onPanResponderMove: (e, gesture) => {
                console.log('move', gesture.dy);

                animatedValue.setValue(gesture.dy)
            },
            onPanResponderRelease: (e, gesture) => {
                console.log('release', gesture.dy);

                lastGestureDy.current += gesture.dy
                if (lastGestureDy.current < maxUpwardTranslateY) {
                    lastGestureDy.current = maxUpwardTranslateY
                }
                else if (lastGestureDy.current > maxDownwordTranslateY) {
                    lastGestureDy.current = maxDownwordTranslateY
                }

                if (gesture.dy > 0) {
                    //drag down
                    if (gesture.dy <= dragThreshold) {
                        springAnimation('up')
                    }
                    else {
                        springAnimation('down')
                    }

                } else {
                    //drag down
                    if (gesture.dy >= -dragThreshold) {
                        springAnimation('down')
                    }
                    else {
                        springAnimation('up')
                    }
                }
            }
        })
    ).current;
    const springAnimation = (direction = 'up' | 'down') => {
        lastGestureDy.current =
            direction == 'down' ?
                maxDownwordTranslateY : maxUpwardTranslateY

        Animated.spring(animatedValue, {
            toValue: lastGestureDy.current,
            useNativeDriver: true
        }).start

    }
    const bottomSheetAnimation = {
        transform: [{
            translateY: animatedValue.interpolate({
                inputRange: [maxUpwardTranslateY, maxDownwordTranslateY],
                outputRange: [maxUpwardTranslateY, maxDownwordTranslateY],
                extrapolate: "clamp"
            })
        }]
    }
    const getGroupData = () => {
        // let user_id = registerCTX?.loginData?.user_id
        let user_id = "be31d44f-2c0b-40ae-b082-469868a19866"
        console.log('be31d44f-2c0b-40ae-b082-469868a19866', user_id);
        const payload = {
            user_id
        }
        if (user_id == null || user_id == "") {
            {
                Toast.show({
                    type: "error",
                    text1: "error",
                    text2: `Something went wrong, re login and try`,
                });
            }
        }
        else {
            dispatch(GetUserGroupList(payload)).then((res) => {
                console.log('add group return', res?.payload?.data);
                if (res?.payload?.data?.data) {
                    let data = res?.payload?.data?.data
                    let newdata = data?.map((list, i) => {
                        return { ...list, title: list.group_description }
                    })
                    setTripsData(newdata)
                }
                else {
                    Toast.show({
                        type: "error",
                        text1: "error",
                        text2: `error in fetching data`,
                    });
                }
            }).finally(() => {
                // setLoading(false)
            })
        }
    }
    useEffect(() => {
        getGroupData()
        animatedValue.setValue(0)
        return () => {
        }
    }, [])
    const Item = ({ title }) => (
        <TouchableOpacity onPress={() => { setSelectedTrip(title), onClose() }} style={[FlexStyles.gap10, FlexStyles.flexDirectionrow, FlexStyles.alignItems]}>
            <FontAwesomIcon name="search" color={Colors.grey1} size={14} />
            <Text style={styles.subText}>{title}</Text>
        </TouchableOpacity>
    );
    const ItemFD = ({ name, nickname, gender }) => (
        <TouchableOpacity style={{ paddingTop: 8 }}
            onPress={() => { }}
        >
            <View style={[FlexStyles.flexDirectioncolumn, FlexStyles.alignItems]}>
                <View style={[styles.imgView]}>
                    <Image source={gender == "F" ? woman : men} style={styles.image} />
                </View>
                <Text style={styles.imgText}>{name}</Text>
            </View>
        </TouchableOpacity>

    );
    const handleSearch = (query) => {
        setIsLoading(true)
        console.log('query', query);
        if (query) {
            setsearchQuery(query)
            const formittedQuery = query.toLowerCase();
            const filteredData = filter(fullData, (user) => {
                return contains(user, formittedQuery);
            })
            setTripsData(filteredData)
            setIsLoading(false)

        }
    }

    const contains = ({ title }, query) => {
        if (title?.toLowerCase()?.includes(query)) {
            return true
        }
        else {
            return false
        }
    }
    const keyExtractor = (item, idx) => {
        console.log('ite,m', idx);
        return idx.toString();
    };
    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}>
            <View style={[styles.container]}>
                <Animated.View style={[styles.bottomSheet, bottomSheetAnimation]}>
                    <View style={styles.dragarea} {...panResponder.panHandlers}>
                        <View style={[styles.dragHandler]} />
                    </View>

                    <View style={[FlexStyles.flexDirectionrow, FlexStyles.alignItems, styles.pl20, { width: "100%" }]}>
                        <TouchableOpacity onPress={onCross} style={{ backgroundColor: Colors.gray4, padding: 10, borderRadius: 100 }} >
                            <FontAwesomIcon name="arrow-left" color={Colors.dark} size={12} />
                        </TouchableOpacity>
                        <View style={[styles.searchOuterView, styles.pl20]}>
                            <FontAwesomIcon name="search" color={Colors.grey1} size={14} />
                            <TextInput
                                style={[styles.searchInput]}
                                placeholder='Search'
                                clearButtonMode="always"
                                placeholderTextColor={Colors.darkGrey}
                                clearTextOnFocus={true}
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={searchQuery}
                                onChangeText={(query) => handleSearch(query)}
                            />
                            <TouchableOpacity onPress={() => setsearchQuery('')} style={styles.cross} >
                                <Entypo name="cross" color={searchQuery ? Colors.dark : Colors.gray} size={14} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.ph20, FlexStyles.flexDirectionrow, FlexStyles.flexBetween, { color: Colors.darkGrey, marginVertical: 20 }]}>
                        <Text style={[{color: Colors.gray,fontSize:12  }]}>{"Recent"}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("AddGroup")} >
                            <Text style={[{ color: Colors.gray,fontSize:12 }]}>{"Add Group"}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={true} style={{ opacity: 1 }}>
                        <View style={styles.childView}>
                            <View style={[styles.pl20]}>
                                <FlatList
                                    data={tripsData}
                                    renderItem={({ item }) => <Item title={item.title} />}
                                    keyExtractor={keyExtractor}

                                />
                            </View>
                        </View>
                    </ScrollView>
                    {/* <View style={[styles.childView2, FlexStyles.justifyContainstart]}>
                        <Text style={styles.imgText}>{'All'}</Text>
                        <FlatList
                            data={Friends}
                            horizontal={true}
                            style={{ width: '100%' }}
                            renderItem={({ item }) => <ItemFD name={item.name} nickname={item.nickname} gender={item.gender} />}
                            keyExtractor={item => item.id}
                        />
                    </View> */}

                </Animated.View>
            </View>
        </SafeAreaView>
    )
}

export default BottomSheet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white1,
    },
    cross: {
        position: 'absolute',
        right: 10
    },
    imgView: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },

    dragarea: {
        width: 132,
        height: 32,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    dragHandler: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 100,
        height: 6,
        backgroundColor: "#d3d3d3"
    },
    childView: {
        flex: 1,
    },
    childView2: {
        paddingBottom: 10,
    },
    searchOuterView: {
        flexDirection: 'row',
        backgroundColor: '#EFECE5',
        borderRadius: 40,
        alignItems: 'center',
        color: Colors.gray,
        // marginRight: 20,
        // marginTop: 10,
        width: "85%",
        marginLeft: 5
    },
    searchInput: {
        fontSize: 12,
        color: Colors.darkGrey,
        paddingHorizontal: 10
    },
    pl20: {
        paddingLeft: 20
    },
    ph20: {
        paddingHorizontal: 20
    },
    subText: {
        fontSize: 12,
        margin: 10,
        opacity: 1,
        color: Colors.gray
    },
    crossText: {
        fontSize: 18,
        margin: 10,
        fontWeight: 'bold',
        opacity: 0.6
    },
    cross: {
        position: 'absolute',
        right: WINDOW_WIDTH * 0.05,
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 10,
    },
    imgText: {
        fontSize: 14,
        color: Colors.dark,
        paddingHorizontal: 8,
        marginTop: 5
    },
    bottomSheet: {
        position: 'absolute',
        backgroundColor: Colors.white1,
        width: '100%',
        height: bottomSheetMaxHeight,
        bottom: bottomSheetMinHeight - bottomSheetMaxHeight,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        // paddingBottom: 40,

        ...Platform.select({
            android: { elevation: 3 },
            ios: {
                shadowColor: "#a8bed2",
                shadowOpacity: 1,
                shadowRadius: 6,
                shadowOffset: {
                    width: 2,
                    height: 2
                }
            }
        })
    },
    searchBox: {
        paddingHorizontal: WINDOW_WIDTH * 0.051,
        paddingVertical: WINDOW_HEIGHT * 0.01,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        color: Colors.black,
        marginTop: WINDOW_HEIGHT * 0.01
    },
    loaderView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})