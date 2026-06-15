import { useParams } from "react-router-dom";
import { usePhone } from "../../../../hooks/usePhone";
import PhoneSkeleton from "./PhoneSkeleton/PhoneSkeleton";
import Container from "../../../../components/ui/Container/Container";
import styles from "./PhoneDetailsPage.module.css";

const PhoneDetailsPage = ({ phoneId }) => {
  const { id: urlId } = useParams();

  const targetId = phoneId || urlId;

  const { phone, isLoading } = usePhone(targetId);

  if (isLoading) return <PhoneSkeleton />;
  if (!phone) return <Container>Номер не найден</Container>;

  return (<>
    <div className={styles.phoneContainer}>
      <h3 className={styles.title}>{phone.title}</h3>
      <small className={styles.phoneNum}>{phone.phone}</small>
      <p className={styles.description}>{phone.description}</p>
    </div>
  </>
  );
};

export default PhoneDetailsPage;