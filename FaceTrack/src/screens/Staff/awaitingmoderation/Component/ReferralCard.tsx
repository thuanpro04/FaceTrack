import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ReferralRequest} from '../AwaitingModerationScreen';
import {RowComponent, TextComponent} from '../../../../components/layout';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
interface Props {
  request: ReferralRequest;
}
const ReferralCard = (props: Props) => {
  const {request} = props;
  const [expanded, setExpanded] = useState(false);
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ActivityIndicator size={20} color="#FF9500" />;
      case 'approved':
        return <AntDesign name="checkcircle" size={20} color="#34C759" />;
      case 'rejected':
        return <AntDesign name="closecircle" size={20} color="#FF3B30" />;
      default:
        return null;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'approved':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ duyệt';
      case 'approved':
        return 'Đã được duyệt';
      case 'rejected':
        return 'Đã bị từ chối';
      default:
        return 'Không xác định';
    }
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.statusContainer}>
            {renderStatusIcon(request.status)}
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(request.status)},
              ]}>
              {getStatusText(request.status)}
            </Text>
          </View>
          <Text style={styles.referralCode}>{request.referralCode}</Text>
          <Text style={styles.submitDate}>
            Gửi lúc: {formatDate(request.submittedAt)}
          </Text>
        </View>
        <AntDesign name={expanded ? 'up' : 'down'} size={16} color="#8E8E93" />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.cardContent}>
          {request.manager && (
            <View style={styles.managerSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="person" size={20} color="#007AFF" />
                <TextComponent
                  label="Thông tin Quản lý"
                  styles={styles.sectionTitle}
                />
              </View>
              <View style={styles.managerInfo}>
                <View style={styles.avatar}>
                  <TextComponent
                    label={
                      request.manager.fullName.split(' ').pop()?.charAt(0) ?? ''
                    }
                    styles={styles.avatarText}
                  />
                </View>
                <View style={styles.managerDetails}>
                  <TextComponent
                    label={request.manager.fullName}
                    styles={styles.managerName}
                  />
                  <TextComponent
                    label={request.manager.position}
                    styles={styles.managerPosition}
                  />
                  <TextComponent
                    label={request.manager.department}
                    styles={styles.managerDepartment}
                  />
                  <View style={styles.contactInfo}>
                    <View style={styles.contactRow}>
                      <MaterialIcons name="email" size={14} color="#8E8E93" />
                      <TextComponent
                        label={request.manager.email}
                        styles={styles.contactText}
                      />
                    </View>
                    <View style={styles.contactRow}>
                      <MaterialIcons name="phone" size={14} color="#8E8E93" />
                      <TextComponent
                        label={request.manager.phone}
                        styles={styles.contactText}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {request.adminResponse && (
            <View style={styles.responseSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="feedback" size={20} color="#34C759" />
                <TextComponent
                  label="Phản hồi từ Admin"
                  styles={styles.sectionTitle}
                />
              </View>
              <TextComponent
                label={request.adminResponse.message}
                styles={styles.responseMessage}
              />
              <TextComponent
                label={`Phản hồi lúc: ${formatDate(
                  request.adminResponse.reviewedAt,
                )}`}
                styles={styles.responseDate}
              />
            </View>
          )}

          <View style={styles.requestInfo}>
            <TextComponent
              label={`ID: ${request.id}`}
              styles={styles.requestId}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ReferralCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,

  },
  cardHeaderLeft: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  submitDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  managerSetion: {
    marginBottom: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  managerInfo: {
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  managerSection: {
    marginBottom: 16,
  },
  managerDetails: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  managerPosition: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 2,
  },
  managerDepartment: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 6,
  },
  responseSection: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  responseMessage: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  responseDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  requestInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  requestId: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
