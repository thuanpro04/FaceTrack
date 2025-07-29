import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SpaceComponent, TextComponent} from '../../../../components/layout';

interface Props {
  user: any;
  error: any;
  focusedInput: string;
  setFocusedInput: (value: string) => void;
  onChangeUserInfo: (key: string, value: string | number | string[]) => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

const SKILL_OPTIONS = [
  'Pha chế',
  'Order món',
  'Phục vụ khách hàng',
  'Lễ tân',
  'Vệ sinh khu vực làm việc',
  'Thu ngân',
  'Sắp xếp hàng hóa',
  'Tư vấn sản phẩm',
  'Giao tiếp tốt',
  'Giải quyết khiếu nại',
  'Làm việc nhóm',
  'Quản lý thời gian',
  'Chịu được áp lực cao',
  'Kiểm kê hàng hóa',
  'Nhập kho hàng',
  'Sử dụng máy POS',
  'Sắp xếp kho',
  'Làm việc theo ca',
  'Quản lý đơn hàng',
  'Chăm sóc khách hàng',
  'Kiểm tra hạn sử dụng',
  'Bảo quản thực phẩm',
  'Sử dụng thiết bị nhà bếp',
  'Trang trí món ăn/thức uống',
  'Tiếng Anh giao tiếp cơ bản',

  // Bổ sung thêm
  'Dọn dẹp sau khi đóng quán',
  'Tiếp nhận và xử lý đơn online',
  'Kiểm soát tồn kho',
  'Sử dụng phần mềm bán hàng',
  'Thái độ phục vụ chuyên nghiệp',
  'Đóng gói sản phẩm mang đi',
  'Chuẩn bị nguyên liệu',
  'Đào tạo nhân viên mới',
  'Chăm sóc fanpage/quản lý MXH',
  'Chạy bàn',
  'Chuẩn bị dụng cụ ăn uống',
  'Tiếp nhận đơn đặt bàn',
  'Hỗ trợ tổ chức sự kiện',
  'Hỗ trợ khách nước ngoài',
  'Kỹ năng lắng nghe',
  'Quản lý tiền mặt',
  'Bán hàng tại quầy',
  'Làm bánh cơ bản',
];

const EXPERIENCE_LEVELS = [
  {value: 0, label: 'Mới bắt đầu', desc: 'Dưới 1 năm', icon: 'school'},
  {
    value: 1,
    label: '1-2 năm',
    desc: 'Có kinh nghiệm cơ bản',
    icon: 'work_outline',
  },
  {value: 3, label: '3-5 năm', desc: 'Có kinh nghiệm trung bình', icon: 'work'},
  {value: 6, label: '6+ năm', desc: 'Có kinh nghiệm cao', icon: 'star'},
];

const RenderSetUpStep2 = ({
  user,
  error,
  focusedInput,
  setFocusedInput,
  onChangeUserInfo,
  fadeAnim,
  slideAnim,
}: Props) => {
  const [searchSkill, setSearchSkill] = useState('');
  const [showAllSkills, setShowAllSkills] = useState(false);

  const filteredSkills = SKILL_OPTIONS.filter(skill =>
    skill.toLowerCase().includes(searchSkill.toLowerCase()),
  );

  const displayedSkills = showAllSkills
    ? filteredSkills
    : filteredSkills.slice(0, 12);

  const toggleSkill = (skill: string) => {
    const currentSkills = user.staff.skills || [];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s: string) => s !== skill)
      : [...currentSkills, skill];
    onChangeUserInfo('staff.skills', updatedSkills);
  };

  const renderAnimatedInput = (
    placeholder: string,
    value: string | number,
    onChangeText: (text: string) => void,
    iconName: string,
    fieldKey: string,
    animationIndex: number,
    multiline = false,
    keyboardType: any = 'default',
  ) => {
    const inputAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 500,
        delay: animationIndex * 150,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.inputContainer,
          {
            opacity: inputAnim,
            transform: [
              {
                translateY: inputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}>
        <View
          style={[
            styles.inputWrapper,
            multiline && styles.textAreaWrapper,
            focusedInput === fieldKey && styles.inputWrapperFocused,
            error[fieldKey] && styles.inputWrapperError,
          ]}>
          <LinearGradient
            colors={
              focusedInput === fieldKey
                ? ['#667eea', '#764ba2']
                : ['#f8fafc', '#f1f5f9']
            }
            style={[
              styles.inputIconContainer,
              multiline && styles.textAreaIcon,
            ]}>
            <Icon
              name={iconName}
              size={20}
              color={focusedInput === fieldKey ? '#ffffff' : '#64748b'}
            />
          </LinearGradient>

          <TextInput
            style={[styles.input, multiline && styles.textAreaInput]}
            value={value.toString()}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlignVertical={multiline ? 'top' : 'center'}
            onFocus={() => setFocusedInput(fieldKey)}
            onBlur={() => setFocusedInput('')}
          />

          {value && (
            <TouchableOpacity
              onPress={() => onChangeText('')}
              style={[
                styles.clearButton,
                multiline && styles.textAreaClearButton,
              ]}
              activeOpacity={0.6}>
              <Icon name="close" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {error[fieldKey] && (
          <TextComponent styles={styles.errorText} label={error[fieldKey]} />
        )}
      </Animated.View>
    );
  };

  const renderExperienceCard = (item: any, index: number) => {
    const isSelected =
      user.staff.experience >= item.value &&
      (index === EXPERIENCE_LEVELS.length - 1 ||
        user.staff.experience < EXPERIENCE_LEVELS[index + 1]?.value);

    return (
      <TouchableOpacity
        key={item.value}
        style={styles.experienceCard}
        onPress={() => onChangeUserInfo('staff.experience', item.value)}
        activeOpacity={0.8}>
        {isSelected ? (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.experienceCardSelected}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.experienceIconContainer}>
              <Icon name={item.icon} size={24} color="#ffffff" />
            </LinearGradient>
            <TextComponent
              styles={styles.experienceLabelSelected}
              label={item.label}
            />
            <TextComponent
              styles={styles.experienceDescSelected}
              label={item.desc}
            />
          </LinearGradient>
        ) : (
          <View style={styles.experienceCardUnselected}>
            <View style={styles.experienceIconContainerUnselected}>
              <Icon name={item.icon} size={24} color="#64748b" />
            </View>
            <TextComponent styles={styles.experienceLabel} label={item.label} />
            <TextComponent styles={styles.experienceDesc} label={item.desc} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSkillChip = (skill: string, isSelected: boolean) => {
    return (
      <TouchableOpacity
        key={skill}
        style={styles.skillChip}
        onPress={() => toggleSkill(skill)}
        activeOpacity={0.8}>
        {isSelected ? (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.skillChipSelected}>
            <TextComponent styles={styles.skillTextSelected} label={skill} />
            <Icon name="check" size={16} color="#ffffff" />
          </LinearGradient>
        ) : (
          <View style={styles.skillChipUnselected}>
            <TextComponent styles={styles.skillText} label={skill} />
            <Icon name="add" size={16} color="#64748b" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      <Animated.View
        style={[
          styles.stepContent,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <Animated.View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.sectionIcon}>
              <Icon name="person" size={20} color="#ffffff" />
            </LinearGradient>
            <TextComponent
              styles={styles.sectionTitle}
              label={'Giới thiệu bản thân'}
            />
          </View>

          {renderAnimatedInput(
            'Hãy viết vài dòng giới thiệu về bản thân, kinh nghiệm và mục tiêu nghề nghiệp của bạn...',
            user.staff.bio || '',
            text => onChangeUserInfo('staff.bio', text),
            'edit',
            'bio',
            0,
            true,
          )}
        </Animated.View>

        <Animated.View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.sectionIcon}>
              <Icon name="timeline" size={20} color="#ffffff" />
            </LinearGradient>
            <TextComponent
              styles={styles.errorText}
              label={'Kinh nghiệm làm việc'}
            />
          </View>

          <View style={styles.experienceGrid}>
            {EXPERIENCE_LEVELS.map((item, index) =>
              renderExperienceCard(item, index),
            )}
          </View>

          {error.experience && (
            <TextComponent styles={styles.errorText} label={error.experience} />
          )}
        </Animated.View>

        <Animated.View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.sectionIcon}>
              <Icon name="business" size={20} color="#ffffff" />
            </LinearGradient>
            <TextComponent
              styles={styles.sectionTitle}
              label={`Số nơi đã làm việc`}
            />
          </View>

          {renderAnimatedInput(
            'Nhập số nơi bạn đã từng làm việc',
            user.staff.totalWorkplaces ?? 0,
            text =>
              onChangeUserInfo('staff.totalWorkplaces', parseInt(text) || 0),
            'domain',
            'totalWorkplaces',
            1,
            false,
            'numeric',
          )}
        </Animated.View>

        <Animated.View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.sectionIcon}>
              <Icon name="construction" size={20} color="#ffffff" />
            </LinearGradient>
            <View style={styles.sectionTitleContainer}>
              <TextComponent styles={styles.sectionTitle} label={`Kỹ năng`} />
              <TextComponent
                styles={styles.sectionSubtitle}
                label={`Đã chọn: ${user.staff.skills?.length || 0} kỹ năng`}
              />
            </View>
          </View>
          <View style={styles.skillSearchContainer}>
            <View
              style={[
                styles.inputWrapper,
                styles.skillSearchWrapper,
                focusedInput === 'skillSearch' && styles.inputWrapperFocused,
              ]}>
              <LinearGradient
                colors={
                  focusedInput === 'skillSearch'
                    ? ['#667eea', '#764ba2']
                    : ['#f8fafc', '#f1f5f9']
                }
                style={styles.inputIconContainer}>
                <Icon
                  name="search"
                  size={20}
                  color={focusedInput === 'skillSearch' ? '#ffffff' : '#64748b'}
                />
              </LinearGradient>

              <TextInput
                style={styles.input}
                value={searchSkill}
                onChangeText={setSearchSkill}
                placeholder="Tìm kiếm kỹ năng..."
                placeholderTextColor="#94a3b8"
                onFocus={() => setFocusedInput('skillSearch')}
                onBlur={() => setFocusedInput('')}
              />

              {searchSkill && (
                <TouchableOpacity
                  onPress={() => setSearchSkill('')}
                  style={styles.clearButton}
                  activeOpacity={0.6}>
                  <Icon name="close" size={18} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.skillsContainer}>
            <View style={styles.skillsGrid}>
              {displayedSkills.map(skill =>
                renderSkillChip(skill, user.staff.skills?.includes(skill)),
              )}
            </View>

            {filteredSkills.length > 12 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAllSkills(!showAllSkills)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={[
                    'rgba(102, 126, 234, 0.1)',
                    'rgba(118, 75, 162, 0.1)',
                  ]}
                  style={styles.showMoreGradient}>
                  <TextComponent
                    styles={styles.showMoreText}
                    label={
                      showAllSkills
                        ? 'Thu gọn'
                        : `Xem thêm ${filteredSkills.length - 12} kỹ năng`
                    }
                  />
                  <Icon
                    name={showAllSkills ? 'expand_less' : 'expand_more'}
                    size={20}
                    color="#667eea"
                  />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {error.skills && <Text style={styles.errorText}>{error.skills}</Text>}
        </Animated.View>

        <SpaceComponent height={20} />
      </Animated.View>
    </ScrollView>
  );
};

export default RenderSetUpStep2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContent: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    minHeight: 120,
  },
  inputWrapperFocused: {
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.2,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textAreaIcon: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingVertical: 16,
  },
  textAreaInput: {
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  clearButton: {
    padding: 8,
    marginRight: 4,
  },
  textAreaClearButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 56,
    fontWeight: '500',
  },
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  experienceCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  experienceCardSelected: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  experienceCardUnselected: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
  },
  experienceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceIconContainerUnselected: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceLabelSelected: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  experienceLabel: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  experienceDescSelected: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  experienceDesc: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  skillSearchContainer: {
    marginBottom: 20,
  },
  skillSearchWrapper: {
    marginBottom: 0,
  },
  skillsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  skillChipSelected: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillChipUnselected: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillTextSelected: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  skillText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  showMoreButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  showMoreGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  showMoreText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
});
