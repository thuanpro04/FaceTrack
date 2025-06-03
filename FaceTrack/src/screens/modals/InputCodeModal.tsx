import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextComponent} from '../../components/layout';
import appColors from '../../constants/appColors';

interface Props {
  onClose: () => void;
  visible: boolean;
  onSubmit: (code: string) => void;
}

const InputCodeModal = (props: Props) => {
  const {onClose, visible, onSubmit} = props;
  const [isVisible, setIsVisible] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    setIsVisible(visible);
    if (!visible) setCode('');
  }, [visible]);

  const handleConfirm = () => {
    if (onSubmit) onSubmit(code);
    setCode('');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={onClose}
      animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <TextComponent label="Nhập mã giới thiệu" styles={styles.title} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mã code..."
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                autoFocus
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleConfirm}
                  disabled={!code.trim()}>
                  <TextComponent label="Xác nhận" styles={styles.buttonText} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}>
                  <TextComponent
                    label="Huỷ"
                    styles={[styles.buttonText, {color: appColors.buttonPrimary}]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InputCodeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: appColors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    color: appColors.buttonPrimary,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: appColors.buttonPrimary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: appColors.text,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: appColors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: appColors.buttonPrimary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
