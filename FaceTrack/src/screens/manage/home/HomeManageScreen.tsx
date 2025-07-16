import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  TextComponent,
} from '../../../components/layout';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/slices/authSlice';
import appColors from '../../../constants/appColors';
import {appSize} from '../../../constants/appSize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';

const HomeManageScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyễn Văn A',
    companyCode: 'ABC123',
    subscriptionType: 'Trial',
    daysLeft: 25,
    totalEmployees: 12,
    activeEmployees: 10,
  });
  const handleUpgrade = () => {};
  return (
    <ContainerComponent>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <RowComponent styles={styles.header}>
          <View style={styles.headerContainer}>
            <TextComponent label="Xin chào" styles={styles.greeting} />
            <TextComponent label={userInfo.name} styles={styles.userName} />
            <TextComponent
              label={userInfo.companyCode}
              styles={styles.companyCode}
            />
          </View>
          <ButtonAnimation onPress={() => {}} styles={styles.profileButton}>
            <Icon name="account-circle" size={40} color="#4CAF50" />
          </ButtonAnimation>
        </RowComponent>
        <View
          style={[
            styles.subscriptionCard,
            userInfo.subscriptionType === 'Trial'
              ? styles.trialCard
              : styles.premiumCard,
          ]}>
          <RowComponent styles={styles.subscriptionTitle}>
            <TextComponent
              styles={styles.subscriptionTitle}
              label={
                userInfo.subscriptionType === 'Trial'
                  ? 'Gói dùng thử'
                  : 'Gói Premium'
              }
            />
            <Icon name="star" size={20} color="#FFD700" />
          </RowComponent>
          {userInfo.subscriptionType === 'Trial' ? (
            <>
              <TextComponent
                styles={styles.subscriptionText}
                label={`Còn lại ${userInfo.daysLeft} ngày dùng thử`}
              />
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}>
                <TextComponent
                  label="Nâng cấp Premium"
                  styles={styles.upgradeButtonText}
                />
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
    </ContainerComponent>
  );
};

export default HomeManageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: appColors.background,
    marginBottom: 15,
  },
  headerContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: appSize.body,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    color: '#666',
  },
  companyCode: {
    fontSize: appSize.caption,
    color: '#666',
  },
  profileButton: {
    padding: 5,
  },
  subscriptionCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trialCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  premiumCard: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
