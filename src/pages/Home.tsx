import { Center, Flex, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAppContext } from "AppContext";
import styled from "styled-components";

const HomePage = () => {
  const { t } = useAppContext();

  return (
    <Center>
      <Flex direction="column" align="center" gap={20}>
        <Text size="34px" fw={100} ta="center">
          {t.welcome}
        </Text>
        <Text fw={200} ta="center">
          {t.welcomeMessage}
        </Text>
        <Icon size={36} />
      </Flex>
    </Center>
  );
};

const Icon = styled(IconArrowLeft)`
  @media (max-width: 767px) {
    transform: rotate(45deg);
  }
`;

export default HomePage;
