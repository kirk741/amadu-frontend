import { useEffect, useState } from "react";
import client from "../../api/client";
import styles from './PhonesPage.module.css';
import Container from "../../components/common/Container/Container";
import EmptyCard from "../../components/common/EmptyCard/EmptyCard";
import Skeleton from "../../components/common/Skeleton/Skeleton";

const PhonesPage = () => {
  const [phones, setPhones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPhones = async () => {
    setIsLoading(true);
    try {
      const response = await client('/support-phones');
      const result = response.data?.data || response.data || [];
      setPhones(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPhones();
  }, []);

  return (
    <div className={styles.list}>
      {isLoading && [1, 2, 3].map((n) => <Skeleton key={n} />)}

      {!isLoading && phones.length === 0 && (
        <EmptyCard text="Телефонов пока нет" link={'/'} />
      )}

      {!isLoading && phones.map((item) => (
        <a
          key={item.id}
          href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
          className={styles.phoneLink}
          style={{textDecoration: 'none'}}
        >
          <Container
            className={styles.phoneContainer}
            buttonIcons={[]}
          >
            <div className={styles.textData}>
              <h3>{item.name}</h3>
              <p className={styles.phoneNumber}>{item.phone}</p>
              {item.description && <small>{item.description}</small>}
            </div>
          </Container>
        </a>
      ))}
    </div>
  );
};

export default PhonesPage;
