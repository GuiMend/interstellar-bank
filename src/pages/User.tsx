import {
  ActionIcon,
  Flex,
  NumberFormatter,
  Skeleton,
  Space,
  Table,
  Text,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getPlanetById, getTransactionByUserId, getUserById } from "api";
import { LanguageType, useAppContext } from "AppContext";
import Loading from "components/Loading";
import PageDetailsFilterCards from "components/PageDetailsFilterCards";
import PageDetailsHeader from "components/PageDetailsHeader";
import StatusChip from "components/StatusChip";
import InfoTable, { Order } from "components/Table";
import UserDetails from "components/UserDetails";
import { useMemo, useState } from "react";
import { redirect, useParams, useSearchParams } from "react-router-dom";
import { Transaction } from "server";
import { colorByCurrencyAmount } from "utils/currencyTypeColor";
import { formatDate } from "utils/dateFormat";

const UserPage: React.FC = () => {
  const { t, exchangeRate } = useAppContext();
  const [lastCopiedId, setLastCopiedId] = useState<string>();
  const [searchParams] = useSearchParams();
  const orderId = (searchParams.get("id") ?? "") as Order;
  const orderFrom = (searchParams.get("from") ?? "") as Order;
  const orderAmount = (searchParams.get("amount") ?? "") as Order;
  const orderDate = (searchParams.get("date") ?? "") as Order;
  const orderStatus = (searchParams.get("status") ?? "") as Order;
  const currencyFilter = searchParams.get("currency") ?? "";
  const statusFilter = searchParams.get("statusFilter") ?? "";

  const { userId = "", lang = "en" } = useParams<{
    userId: string;
    lang: LanguageType;
  }>();

  const { isPending, data: user } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(parseInt(userId)),
  });

  const { isPending: transactionsIsPending, data: transactions } = useQuery({
    queryKey: ["transactions", "user", userId],
    queryFn: () => getTransactionByUserId(parseInt(userId)),
    // Fetch after user has been fetched
    enabled: !!user?.id,
  });

  const { isPending: planetIsPending, data: homeworld } = useQuery({
    queryKey: ["planets", user?.homeworld],
    queryFn: () => getPlanetById(parseInt(user?.homeworld ?? "")),
    enabled: !!user?.id,
  });

  const filteredTransactions = useMemo(() => {
    return transactions
      ?.filter((transaction) =>
        currencyFilter ? transaction.currency === currencyFilter : true
      )
      .filter((transaction) =>
        statusFilter ? transaction.status === statusFilter : true
      )
      .sort((a, b) => {
        if (!orderStatus) return 0;

        return orderStatus === "asc"
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status);
      })
      .sort((a, b) => {
        if (!orderAmount) return 0;

        return orderAmount === "asc"
          ? b.amount - a.amount
          : a.amount - b.amount;
      })
      .sort((a, b) => {
        if (!orderDate) return 0;

        return orderDate === "asc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .sort((a, b) => {
        if (!orderId) return 0;

        return orderId === "asc"
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id);
      });
  }, [
    currencyFilter,
    orderAmount,
    orderDate,
    orderId,
    orderStatus,
    statusFilter,
    transactions,
  ]);

  const totalTransactions = transactions?.reduce(
    (acc, transaction) => ({
      ...acc,
      [transaction.currency]:
        acc[transaction?.currency as "GCS" | "ICS"] + transaction.amount,
    }),
    { GCS: 0, ICS: 0 }
  ) ?? { GCS: 0, ICS: 0 };

  const renderConversionTransaction = (transaction: Transaction) => {
    if (!exchangeRate) {
      return null;
    }

    if (transaction.currency === "GCS") {
      return {
        currency: "ICS",
        amount: transaction.amount * exchangeRate,
      };
    }

    return {
      currency: "GCS",
      amount: transaction.amount / exchangeRate,
    };
  };

  if (!userId) {
    redirect(`/${lang}/users`);
    return null;
  }

  if (isPending || !user || planetIsPending || !homeworld) {
    return (
      <div>
        <Skeleton height={30} width={100} />
        <Space h={10} />
        <Skeleton height={100} />
      </div>
    );
  }

  return (
    <div>
      <PageDetailsHeader
        title={`${user?.name} (#${userId})`}
        showClearFilters={Boolean(
          orderId ||
            orderAmount ||
            orderDate ||
            orderFrom ||
            orderStatus ||
            currencyFilter ||
            statusFilter
        )}
        transactions={transactions ?? []}
        invalidationQueryKey={["transactions", "user", userId]}
      />
      <Space h={16} />
      <UserDetails user={user} homeworld={homeworld} />
      <Space h={16} />
      <PageDetailsFilterCards {...totalTransactions} />
      <Space h={30} />
      {transactionsIsPending || planetIsPending ? (
        <Loading />
      ) : (
        <InfoTable
          list={filteredTransactions}
          columns={[
            { orderBy: true, label: t.transactions.table.id, key: "id" },
            {
              orderBy: true,
              label: t.transactions.table.amount,
              key: "amount",
            },
            {
              label: t.transactions.table.conversion,
              key: "conversion",
            },
            { orderBy: true, label: t.transactions.table.date, key: "date" },
            {
              orderBy: true,
              label: t.transactions.table.status,
              key: "status",
            },
          ]}
          row={(transaction) => {
            const conversion = renderConversionTransaction(transaction);
            return (
              <>
                <Table.Td>
                  <Flex justify="space-between">
                    <span>{transaction.id.substring(0, 8)}...</span>
                    <ActionIcon
                      variant="transparent"
                      aria-label="Copy ID"
                      onClick={() => {
                        navigator.clipboard.writeText(transaction.id);
                        setLastCopiedId(transaction.id);
                      }}
                    >
                      {lastCopiedId === transaction.id ? (
                        <IconCheck style={{ width: "70%", height: "70%" }} />
                      ) : (
                        <IconCopy
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      )}
                    </ActionIcon>
                  </Flex>
                </Table.Td>
                <Table.Td>
                  <Text
                    c={colorByCurrencyAmount(
                      transaction.amount,
                      transaction.currency
                    )}
                  >
                    {transaction.currency}{" "}
                    <NumberFormatter
                      value={transaction.amount.toFixed(3)}
                      thousandSeparator
                    />
                  </Text>
                </Table.Td>
                <Table.Td>
                  {conversion?.amount && conversion.currency ? (
                    <Text
                      c={colorByCurrencyAmount(
                        conversion?.amount,
                        conversion?.currency
                      )}
                    >
                      {conversion?.currency}{" "}
                      <NumberFormatter
                        value={conversion?.amount.toFixed(3)}
                        thousandSeparator
                      />
                    </Text>
                  ) : (
                    "unknown"
                  )}
                </Table.Td>
                <Table.Td style={{ minWidth: 115 }}>
                  {formatDate(new Date(transaction.date), lang)}
                </Table.Td>
                <Table.Td>
                  <StatusChip status={transaction.status} />
                </Table.Td>
              </>
            );
          }}
          rowConfig={(transaction) => ({
            key: transaction.id,
          })}
          translation={t.transactions}
        />
      )}
    </div>
  );
};

export default UserPage;
