import {FlatList, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components/layout';
import HeaderComponent from '../../../components/layout/HeaderComponent';
import {ArrowLeft, SearchFavorite1} from 'iconsax-react-native';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import {userServices} from '../../../services/userServices';
import {infoBase} from '../../data/user.type';
import InformationUserModal from '../../modals/InformationUserModal';
// Lọc các nhân viên thuộc mình quản lý
const AddEmployeeScreen = ({navigation}: any) => {
  const [text, setText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [filteredStaffs, setFilteredStaffs] = useState<infoBase[]>([]);
  const [isVisibleInfoModal, setIsVisibleInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staffs, setStaffs] = useState<infoBase[]>([]);
  const getStaffInfo = async () => {
    try {
      setIsLoading(true);
      const res = await userServices.getStaffInfo(10);
      if (res && res.data?.staffs) {
        console.log('Get staff info successfully: ', res.data.staffs);
        setStaffs(res.data.staffs);
        setFilteredStaffs(res.data.staffs);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Get staff info error: ', error);
      setIsLoading(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  useFocusEffect(
    useCallback(() => {
      getStaffInfo();
    }, []),
  );
  useEffect(() => {
    searchByName();
  }, [text]);
  const searchByName = () => {
    const keyWord = text.toLocaleLowerCase().trim();
    if (!keyWord) {
      setFilteredStaffs(staffs);
      return;
    }
    const result = staffs.filter(staff =>
      staff.fullName?.toLocaleLowerCase().includes(keyWord),
    );
    setFilteredStaffs(result);
  };
  const onpPenInfoModal = (user: infoBase) => {
    setIsVisibleInfoModal(true);
    setSelectedUser(user);
  };
  const onCloseInfoModal = () => {
    setIsVisibleInfoModal(false);
  };

  const renderItem = ({item, index}: any) => {
    const skills = item.staff.skills.slice(0, 2);
    const moreSkill = skills.length > 1;

    return (
      <View style={styles.cardContainer}>
        <RowComponent styles={styles.cardRow}>
          {item.profileImageUrl ? (
            <Image source={{uri: item.profileImageUrl}} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <TextComponent
                label={item.fullName.split('')[0]}
                color={appColors.white}
              />
            </View>
          )}
          <View style={styles.cardContent}>
            <RowComponent>
              <TextComponent styles={styles.name} label={item.fullName} />
              <RowComponent styles={styles.ratingRow}>
                <AntDesign
                  name="star"
                  color={'#FED73E'}
                  size={appSize.iconSmall}
                />
                <TextComponent
                  label={`${item.staff.rating}`}
                  styles={styles.labelRating}
                />
              </RowComponent>
            </RowComponent>
            <TextComponent styles={styles.address} label={item.location} />
            <SpaceComponent height={8} />
            <RowComponent styles={styles.skillRow}>
              {skills.map((label: string, index: number) => (
                <View key={index} style={styles.skillContents}>
                  <TextComponent label={label} styles={styles.labelSkills} />
                </View>
              ))}
              <View key={index} style={styles.skillContents}>
                <TextComponent
                  label={'...'}
                  styles={[styles.labelSkills, {letterSpacing: 4}]}
                />
              </View>
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent>
              <TextComponent
                styles={[styles.address, {flex: 1}]}
                label={`Kinh nghiệm: ${item.staff.experience}`}
              />
              <TextComponent
                styles={styles.address}
                label={`${item.staff.totalWorkplaces} nơi làm việc`}
              />
            </RowComponent>
          </View>
        </RowComponent>
        <SpaceComponent height={22} />
        <RowComponent styles={{justifyContent: 'space-around'}}>
          <View style={styles.statusCard}>
            <TextComponent
              label={item.staff.currentStatus ?? 'Đang làm việc'}
              styles={styles.labelStatus}
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <TextComponent
              label={`Hoạt động: ${item.status}`}
              styles={[
                styles.address,
                {
                  fontSize: 12,
                },
              ]}
            />
          </View>
        </RowComponent>
        <SpaceComponent height={12} />
        <TextComponent label={item.staff.bio} styles={styles.bio} />
        <SpaceComponent height={22} />
        <RowComponent styles={styles.btnActiviteRow}>
          <ButtonAnimation
            styles={styles.btnActivite}
            onPress={() => onpPenInfoModal(item)}>
            <TextComponent label="Xem hồ sơ" styles={styles.btnActiviteLabel} />
          </ButtonAnimation>
          <ButtonAnimation
            onPress={() => {}}
            styles={[
              styles.btnActivite,
              {backgroundColor: appColors.primary + 'E6'},
            ]}>
            <TextComponent
              label="Mời vào team"
              styles={[styles.btnActiviteLabel, {color: appColors.white}]}
            />
          </ButtonAnimation>
        </RowComponent>
      </View>
    );
  };
  return (
    <ContainerComponent>
      <HeaderComponent
        onNavigationIcon={() => navigation.goBack()}
        label="Tìm & Thêm nhân viên"
      />
      <View style={styles.main}>
        <View style={styles.searchContainer}>
          <RowComponent styles={styles.searchRow}>
            <SearchFavorite1
              size={appSize.iconSmall}
              color={appColors.iconDefault}
            />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="search name"
              placeholderTextColor={appColors.textGrey}
              style={styles.inputSearchName}
            />
            {text.length > 0 && (
              <ButtonAnimation
                onPress={() => setText('')}
                styles={{alignItems: 'flex-end'}}>
                <AntDesign
                  name="close"
                  size={appSize.iconSmall}
                  color={appColors.iconDefault}
                />
              </ButtonAnimation>
            )}
          </RowComponent>
        </View>
        <SpaceComponent height={12} />
        <View style={styles.body}>
          <RowComponent>
            <TextComponent
              label={`Tìm thấy ${filteredStaffs.length} người`}
              styles={styles.labelResult}
            />
            <ButtonAnimation onPress={() => {}} styles={{}}>
              <TextComponent
                label="Bộ lọc: Gần đây"
                styles={styles.labelFilter}
              />
            </ButtonAnimation>
          </RowComponent>
          <SpaceComponent height={12} />
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            data={filteredStaffs}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            style={{}}
            ListFooterComponent={() => <SpaceComponent height={100} />}
          />
        </View>
      </View>
      <InformationUserModal
        visible={isVisibleInfoModal}
        onClose={onCloseInfoModal}
        user={selectedUser}
      />
    </ContainerComponent>
  );
};

export default AddEmployeeScreen;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 12,
    flex: 1,
  },
  searchContainer: {
    alignItems: 'center',
  },
  searchRow: {
    backgroundColor: appColors.card,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    width: '90%',
    paddingVertical: 8,
  },
  inputSearchName: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 12,
  },
  labelResult: {
    fontWeight: '500',
    flex: 1,
  },
  labelFilter: {
    fontSize: appSize.caption,
    color: appColors.textSecondary,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: appColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: appColors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardRow: {
    gap: 12,
    alignItems: 'center',
  },
  cardContent: {flex: 1},
  name: {
    fontWeight: 'bold',
    flex: 1,
  },
  address: {
    color: appColors.gray,
    fontStyle: 'italic',
    fontSize: appSize.caption,
  },
  skillRow: {
    gap: 14,
  },
  skillContents: {
    backgroundColor: appColors.primary + '33',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  labelSkills: {
    fontSize: appSize.caption,
    color: appColors.primary,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  ratingRow: {
    backgroundColor: '#FFF3CB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  labelRating: {
    fontSize: 12,
  },
  statusCard: {
    backgroundColor: appColors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  labelStatus: {
    fontSize: 12,
    color: appColors.white,
  },
  bio: {
    color: appColors.gray,
    fontStyle: 'italic',
    fontSize: appSize.body,
    fontWeight: '400',
  },
  btnActiviteRow: {
    justifyContent: 'center',
    gap: 22,
  },
  btnActivite: {
    borderWidth: 0.8,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderColor: appColors.primary,
  },
  btnActiviteLabel: {
    color: appColors.primary + 'C4',
    fontWeight: '500',
    fontSize: appSize.body,
  },
});
