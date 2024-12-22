import { Flex } from "@mantine/core";
import TotalTransactions from "./TotalTransactions";
import SingleSelectFilter from "./SingleSelectFilter";
import { useAppContext } from "AppContext";

type PageDetailsFilterCardsProps = {
  additionalFilters?: React.ReactNode;
  additionalCards?: React.ReactNode;
  GCS: number;
  ICS: number;
};

const PageDetailsFilterCards = ({
  additionalFilters,
  additionalCards,
  ...totalTransactions
}: PageDetailsFilterCardsProps) => {
  const { t } = useAppContext();
  return (
    <Flex
      justify="space-between"
      wrap="wrap"
      gap={30}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Flex gap={16}>
        <SingleSelectFilter
          label={t.transactions.selectCurrency}
          selectId="currency"
          options={[
            {
              value: "ICS",
              label: "ICS",
            },
            {
              value: "GCS",
              label: "GCS",
            },
          ]}
        />
        <SingleSelectFilter
          label={t.transactions.selectStatus}
          selectId="statusFilter"
          options={[
            {
              value: "completed",
              label: "Completed",
            },
            {
              value: "inProgress",
              label: "In Progress",
            },
            {
              value: "blocked",
              label: "Blocked",
            },
          ]}
        />
        {additionalFilters}
      </Flex>
      <Flex gap={16} wrap="wrap" direction={{ base: "column", xs: "row" }}>
        {additionalCards}
        <TotalTransactions {...totalTransactions} style={{ flexGrow: 1 }} />
      </Flex>
    </Flex>
  );
};

export default PageDetailsFilterCards;
