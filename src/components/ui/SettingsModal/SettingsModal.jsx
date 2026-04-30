const SettingsModal = ({ onClose }) => {
  const navigate = useNavigate();
  // Достаем саму тему из хука
  const { theme, changeTheme } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true
    // Тему отсюда убираем!
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await client('/user/settings');
        setSettings(response.data);

        // Синхронизируем тему из API с нашим хуком при загрузке
        if (response.data.theme) {
          changeTheme(response.data.theme);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []); // Пустой массив зависимостей оставляем

  const updateSettings = async (newData) => {
    setSettings(prev => ({ ...prev, ...newData }));

    if (newData.theme) {
      changeTheme(newData.theme);
    }

    try {
      await client('/user/settings', {
        method: 'POST',
        // Здесь склеиваем локальные уведомления и актуальную тему
        body: { ...settings, ...newData, _method: 'PATCH' }
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
                // Используем theme из хука вместо settings.theme
                transform: `translateX(${theme === 'light-theme' ? '0%' : '100%'})`
              }}
            />

            <div
              className={`${styles.themeOption} ${theme === 'light-theme' ? styles.active : ''}`}
              onClick={() => updateSettings({ theme: 'light-theme' })}
            >
              <Icons.Sun />
            </div>

            <div
              className={`${styles.themeOption} ${theme === 'dark-theme' ? styles.active : ''}`}
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