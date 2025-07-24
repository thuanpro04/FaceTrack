import {FlatList, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
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
const AddEmployeeScreen = ({navigation}: any) => {
  const [text, setText] = useState('');
  const mockGlobalUsers = [
    {
      id: 'user001',
      name: 'Nguyễn Thị Mai',
      email: 'mai@email.com',
      phone: '0901111111',
      avatar: null,
      skills: ['Pha chế', 'Latte Art'],
      experience: '2 năm',
      location: 'Quận 1, TP.HCM',
      rating: 4.8,
      totalWorkplaces: 3,
      lastActive: '2 giờ trước',
      isAvailable: true,
      bio: 'Có kinh nghiệm làm việc tại các quán cafe specialty',
      currentStatus: 'Đang tìm việc',
      joinedDate: '15/03/2024',
      isInMyTeam: false,
      isInvited: false,
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476495506_2211057015955753_5540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
    {
      id: 'user002',
      name: 'Trần Văn Hùng',
      email: 'hung@email.com',
      phone: '0902222222',
      avatar: null,
      skills: ['Phục vụ', 'Thu ngân', 'Quản lý'],
      experience: '3 năm',
      location: 'Quận 3, TP.HCM',
      rating: 4.9,
      totalWorkplaces: 5,
      lastActive: '1 ngày trước',
      isAvailable: false,
      bio: 'Trưởng ca tại nhiều nhà hàng lớn',
      currentStatus: 'Đang làm việc',
      joinedDate: '10/01/2024',
      isInMyTeam: false,
      isInvited: true,
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476495506_2211057015955753_5540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
    {
      id: 'user003',
      name: 'Lê Thị Hoa',
      email: 'hoa@email.com',
      phone: '0903333333',
      avatar: null,
      skills: ['Bếp', 'Pha chế', 'Trang trí'],
      experience: '1.5 năm',
      location: 'Quận 7, TP.HCM',
      rating: 4.6,
      totalWorkplaces: 2,
      lastActive: '30 phút trước',
      isAvailable: true,
      bio: 'Chuyên về đồ uống và bánh ngọt',
      currentStatus: 'Sẵn sàng làm thêm',
      joinedDate: '20/02/2024',
      isInMyTeam: true,
      isInvited: false,
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476495506_2211057015955753_5540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
    {
      id: 'user004',
      name: 'Phạm Minh Đức',
      email: 'duc@email.com',
      phone: '0904444444',
      avatar: null,
      skills: ['Delivery', 'Phục vụ'],
      experience: '6 tháng',
      location: 'Quận 5, TP.HCM',
      rating: 4.3,
      totalWorkplaces: 1,
      lastActive: '5 giờ trước',
      isAvailable: true,
      bio: 'Sinh viên part-time, sẵn sàng làm ca tối',
      currentStatus: 'Đang tìm việc',
      joinedDate: '05/04/2024',
      isInMyTeam: false,
      isInvited: false,
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476495506_2211057015955753_5540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
  ];
  const renderItem = ({item, index}: any) => {
    const skills = item.skills.splice(0, 2);
    const moreSkill = skills.length > 1;
    return (
      <View style={styles.cardContainer}>
        <RowComponent styles={styles.cardRow}>
          {!item.imageProfileUrl ? (
            <Image source={{uri: item.imageProfileUrl}} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <TextComponent
                label={item.name.split('')[0]}
                color={appColors.white}
              />
            </View>
          )}
          <View style={styles.cardContent}>
            <RowComponent>
              <TextComponent styles={styles.name} label={item.name} />
              <RowComponent styles={styles.ratingRow}>
                <AntDesign
                  name="star"
                  color={'#FED73E'}
                  size={appSize.iconSmall}
                />
                <TextComponent
                  label={`${item.rating}`}
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
                label={`Kinh nghiệm: ${item.experience}`}
              />
              <TextComponent
                styles={styles.address}
                label={`${item.totalWorkplaces} nơi làm việc`}
              />
            </RowComponent>
          </View>
        </RowComponent>
        <SpaceComponent height={22} />
        <RowComponent styles={{justifyContent: 'space-around'}}>
          <View style={styles.statusCard}>
            <TextComponent
              label={item.currentStatus}
              styles={styles.labelStatus}
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <TextComponent
              label={`Hoạt động: ${item.lastActive}`}
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
        <TextComponent label={item.bio} styles={styles.bio} />
        <SpaceComponent height={22} />
        <RowComponent styles={styles.btnActiviteRow}>
          <ButtonAnimation styles={styles.btnActivite} onPress={() => {}}>
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
              label="Tìm thấy 2 người"
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
            data={mockGlobalUsers}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            style={{}}
            ListFooterComponent={() => <SpaceComponent height={100} />}
          />
        </View>
      </View>
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
