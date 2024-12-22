import { Button, Card, Center, Flex, Text } from "@mantine/core";
import { LanguageType, useAppContext } from "AppContext";
import { useNavigate, useParams } from "react-router-dom";

const NotFoundPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: LanguageType }>();
  return (
    <Center>
      <Card>
        <Flex direction="column" align="center" gap={20}>
          <Text size="xl" fw={200}>
            {t.notFound}
          </Text>
          <Text ta="center">
            {t.notFoundMessage}
            <br />
            {t.notFoundCTA}
          </Text>
          <Button onClick={() => navigate(`/${lang}`)} variant="subtle">
            {t.backToHome}
          </Button>
        </Flex>
      </Card>
    </Center>
  );
};

export default NotFoundPage;
