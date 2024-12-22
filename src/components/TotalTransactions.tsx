import { Card, Flex, NumberFormatter, Text } from "@mantine/core";
import { useAppContext } from "AppContext";
import { colorByCurrencyAmount } from "utils/currencyTypeColor";

type TotalTransactionsProps = {
  GCS: number;
  ICS: number;
};

const TotalTransactions = ({ GCS = 0, ICS = 0 }: TotalTransactionsProps) => {
  const { t } = useAppContext();
  return (
    <Card>
      <Text fw={200}>{t.transactions.totalTransactions}</Text>
      <Flex gap={16}>
        <Text fw={400} c={colorByCurrencyAmount(GCS ?? 0, "GCS")}>
          GCS: <NumberFormatter value={GCS.toFixed(3)} thousandSeparator />
        </Text>
        <Text fw={400} c={colorByCurrencyAmount(ICS ?? 0, "ICS")}>
          ICS: <NumberFormatter value={ICS.toFixed(3)} thousandSeparator />
        </Text>
      </Flex>
    </Card>
  );
};

export default TotalTransactions;
export type { TotalTransactionsProps };
