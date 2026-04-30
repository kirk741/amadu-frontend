import { useParams } from "react-router-dom";
import { usePhone } from "../../../../hooks/usePhone";
import PhoneSkeleton from "./PhoneSkeleton/PhoneSkeleton";
import Container from "../../../../components/ui/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import styles from "./PhoneDetailsPage.module.css";

const PhoneDetailsPage = () => {
  const { id } = useParams();
  const { phone, isLoading } = usePhone(id);

  if (isLoading) return <Container><PhoneSkeleton /></Container>;
  if (!phone) return <Container>Номер не найден</Container>;

  return (
    <Container>
      <div className={styles.phoneContainer}>
        <h3 className={styles.title}>{phone.title}</h3>
        <small className={styles.phoneNum}>{phone.phone}</small>
        <p className={styles.description}>{phone.description}</p>
      </div>

      <Button
        className={styles.callBtn}
        onClick={() => window.location.href = `tel:${phone.phone.replace(/[^0-9+]/g, '')}`}
      >
        Позвонить
      </Button>
    </Container>
  );
};

export default PhoneDetailsPage;