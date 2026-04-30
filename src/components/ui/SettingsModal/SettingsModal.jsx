import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './SettingsModal.module.css';
import * as Icons from '../../../assets/icons';
import client from "../../../api/client";
import Modal from "../Modal/Modal";
import { useTheme } from "../../../hooks/useTheme";

const SettingsModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { changeTheme } = useTheme();
  const [settings, setSettings] = useState({
    theme: 'light-theme',
    notifications: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await client('/user/settings');
        setSettings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newData) => {
    setSettings(prev => ({ ...prev, ...newData }));

    if (newData.theme) {
      changeTheme(newData.theme);
    }

    try {
      await client('/user/settings', {
        method: 'POST',
        body: { ...newData, _method: 'PATCH' }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      onClose={onClose}
      childrenData={[
        {
          name: settings.notifications ? 'Отключить уведомления' : 'Включить уведомления',
          onClick: () => updateSettings({ notifications: !settings.notifications })
        },
        {
          name: 'Редактировать профиль',
          onClick: () => navigate('/profile')
        }
      ]}
    >
      <div className={styles.settingsContent}>
        <h3 className={styles.title}>Настройки</h3>
        <div className={styles.mainLayout}>
          <div className={styles.themeSwitcher}>
            <div
              className={styles.activeIndicator}
              style={{
                transform: `translateX(${settings.theme === 'light-theme' ? '0%' : '100%'})`
              }}
            />

            <div
              className={`${styles.themeOption} ${settings.theme === 'light-theme' ? styles.active : ''}`}
              onClick={() => updateSettings({ theme: 'light-theme' })}
            >
              <Icons.Sun />
            </div>

            <div
              className={`${styles.themeOption} ${settings.theme === 'dark-theme' ? styles.active : ''}`}
              onClick={() => updateSettings({ theme: 'dark-theme' })}
            >
              <Icons.Moon />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
