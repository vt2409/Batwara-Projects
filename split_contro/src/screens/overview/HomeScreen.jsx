import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import TabContainer from '../../components/TabContainer';
import {Colors} from '../../constants/Colors';

import FlexStyles from '../../assets/Styles/FlexStyles';
import LandingStyles from './LandinStyless';
import CommonStyles from '../../assets/Styles/CommonStyles';
import CommonCard from '../../shared/CommonCard';
const HomeScreen = () => {
  const [active, setActive] = useState('GE');
  const changeTab = TabType => {
    if (TabType === 'GE') {
      setActive('GE');
    } else {
      setActive('PE');
    }
  };
  return (
    <TabContainer>
      <View
        style={[
          FlexStyles.dflex,
          LandingStyles.card,
          LandingStyles.whiteCardHeight,
        ]}>
        <View
          style={[
            FlexStyles.flexDirectionrow,
            FlexStyles.flexarround,
            FlexStyles.alignItems,
          ]}>
          <TouchableOpacity
            onPress={() => changeTab('GE')}
            style={
              active === 'GE'
                ? [LandingStyles.tabActiveBackground, LandingStyles.tabTop]
                : [LandingStyles.tabInactiveBackground, LandingStyles.tabTop]
            }>
            <Text style={[LandingStyles.tabStyles, LandingStyles.tabText]}>
              Group Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
           onPress={() => changeTab('PE')}
            style={
              active === 'PE'
                ? [LandingStyles.tabActiveBackground, LandingStyles.tabTop]
                : [LandingStyles.tabInactiveBackground, LandingStyles.tabTop]
            }>
            <Text style={[LandingStyles.tabStyles, LandingStyles.tabText]}>
              Personal Expenses
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            FlexStyles.flexDirectionrow,
            FlexStyles.flexBetween,
            CommonStyles.m10,
            FlexStyles.alignItems,
          ]}>
          <View>
            <Text>This Month</Text>
          </View>
          <View>
            <Image
              source={require('../../assets/images/commonImage/filter.png')}
              style={[{width: 30, height: 30}]}
            />
          </View>
        </View>
        <ScrollView>
          <CommonCard />
          <CommonCard />
          <CommonCard />
          <CommonCard />
          <CommonCard />
          <CommonCard />
          <CommonCard />
          <CommonCard />
          <CommonCard />
        </ScrollView>
      </View>
    </TabContainer>
  );
};

export default HomeScreen;
