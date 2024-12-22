import { Button, Flex, Modal, Space, Text, Tooltip } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBatchTransaction } from "api";
import { useAppContext } from "AppContext";
import { useMemo, useState } from "react";
import { Transaction } from "server";
import ClearFilters from "./ClearFilters";

type PageHeaderProps = {
  title: string;
  disabled?: boolean;
  showClearFilters: boolean;
  transactions: Transaction[];
  invalidationQueryKey: QueryKey;
};

const PageDetailsHeader = ({
  title,
  disabled,
  transactions,
  showClearFilters,
  invalidationQueryKey,
}: PageHeaderProps) => {
  const { t, updateGlobalAlert } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isPending, mutate: updateTransactions } = useMutation({
    mutationFn: (transactionToUpdate: Transaction[]) =>
      updateBatchTransaction(transactionToUpdate),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: invalidationQueryKey });
      console.log("updateGlobalAlert", message);
      updateGlobalAlert?.({
        title: t.transactions.alerts.updateSuccess,
        type: "success",
        message,
      });
    },
  });

  const noInProgressTransactions = useMemo(() => {
    return (
      !transactions?.length ||
      transactions.every((t) => t.status !== "inProgress")
    );
  }, [transactions]);

  return (
    <>
      <Flex
        justify="space-between"
        wrap="wrap"
        style={{ minHeight: 36 }}
        gap={16}
      >
        <Text component="h1" fw={200} size="xl">
          {title}
        </Text>
        <Flex gap={16} justify="flex-end" style={{ flexGrow: 1 }}>
          {showClearFilters && <ClearFilters />}
          <Tooltip
            disabled={!noInProgressTransactions}
            label={t.transactions.blockInProgressTooltip}
          >
            <Button
              loading={isPending}
              variant="light"
              leftSection={<IconAlertTriangle />}
              color="red"
              disabled={disabled || noInProgressTransactions}
              onClick={() => setIsModalOpen(true)}
            >
              {t.transactions.blockInProgress}
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Flex gap={8} align="center">
            <IconAlertTriangle
              style={{ color: "var(--mantine-color-red-text)" }}
            />
            <Text fw={700} size="xl" c="red">
              {t.attention}
            </Text>
          </Flex>
        }
      >
        <Text size="lg">{t.attentionMessage}</Text>
        <Space h={16} />
        <Flex gap={16} align="center" justify="flex-end">
          <Button variant="light" onClick={() => setIsModalOpen(false)}>
            {t.no}
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={() => {
              setIsModalOpen(false);
              if (!transactions?.length) return;

              updateTransactions(
                transactions.reduce((acc, curr) => {
                  if (curr.status === "inProgress") {
                    return [...acc, { ...curr, status: "blocked" }];
                  }
                  return acc;
                }, [] as Transaction[])
              );
            }}
          >
            {t.yes}
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default PageDetailsHeader;
