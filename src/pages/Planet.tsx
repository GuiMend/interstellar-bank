import {
  ActionIcon,
  Card,
  Flex,
  NumberFormatter,
  Skeleton,
  Space,
  Table,
  Text,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  getPlanetById,
  getTransactionByMultipleUserId,
  getUsersByHomeworld,
} from "api";
import { LanguageType, useAppContext } from "AppContext";
import Loading from "components/Loading";
import PageDetailsFilterCards from "components/PageDetailsFilterCards";
import PageDetailsHeader from "components/PageDetailsHeader";
import PlanetDetails from "components/PlanetDetails";
import StatusChip from "components/StatusChip";
import InfoTable, { Order } from "components/Table";
import { useMemo, useState } from "react";
import {
  redirect,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Transaction } from "server";
import styled from "styled-components";
import { colorByCurrencyAmount } from "utils/currencyTypeColor";
import { formatDate } from "utils/dateFormat";

const PlanetPage: React.FC = () => {
  const { t, exchangeRate } = useAppContext();
  const navigate = useNavigate();
  const [lastCopiedId, setLastCopiedId] = useState<string>();
  const [searchParams] = useSearchParams();
  const orderId = (searchParams.get("id") ?? "") as Order;
  const orderFrom = (searchParams.get("from") ?? "") as Order;
  const orderAmount = (searchParams.get("amount") ?? "") as Order;
  const orderDate = (searchParams.get("date") ?? "") as Order;
  const orderStatus = (searchParams.get("status") ?? "") as Order;
  const currencyFilter = searchParams.get("currency") ?? "";
  const statusFilter = searchParams.get("statusFilter") ?? "";

  const { planetId = "", lang = "en" } = useParams<{
    planetId: string;
    lang: LanguageType;
  }>();

  const { isPending, data: planet } = useQuery({
    queryKey: ["planets", planetId],
    queryFn: () => getPlanetById(parseInt(planetId)),
  });

  const { isPending: usersIsPending, data: users } = useQuery({
    queryKey: ["users", "planets", planetId],
    queryFn: () => getUsersByHomeworld(parseInt(planetId)),
  });

  const { isPending: transactionsIsPending, data: transactions } = useQuery({
    queryKey: ["transactions", planetId],
    queryFn: () =>
      getTransactionByMultipleUserId(JSON.stringify(planet?.residents) ?? ""),
    // Fetch after planet has been fetched
    enabled: !!planet?.id,
  });

  const indexedUsersById = useMemo(() => {
    return users?.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, { id: string; name: string }>);
  }, [users]);

  const filteredTransactions = useMemo(() => {
    return transactions
      ?.filter((transaction) =>
        currencyFilter ? transaction.currency === currencyFilter : true
      )
      .filter((transaction) =>
        statusFilter ? transaction.status === statusFilter : true
      )
      .map((transaction) => ({
        ...transaction,
        from: indexedUsersById?.[transaction.user]?.name,
      }))
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
        if (!orderFrom || !b.from || !a.from) return 0;

        return orderFrom === "asc"
          ? b.from.localeCompare(a.from)
          : a.from.localeCompare(b.from);
      })
      .sort((a, b) => {
        if (!orderId) return 0;

        return orderId === "asc"
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id);
      });
  }, [
    currencyFilter,
    indexedUsersById,
    orderAmount,
    orderDate,
    orderFrom,
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

  if (!planetId) {
    redirect(`/${lang}/planets`);
    return null;
  }

  if (isPending || !planet) {
    return (
      <div>
        <Skeleton height={30} width={100} />
        <Space h={10} />
        <Skeleton height={130} />
      </div>
    );
  }

  return (
    <div>
      <PageDetailsHeader
        title={`${planet?.name} (#${planetId})`}
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
        invalidationQueryKey={["transactions", planetId]}
      />
      <Space h={16} />
      <PlanetDetails planet={planet} />
      <Space h={30} />
      <PageDetailsFilterCards
        {...totalTransactions}
        additionalCards={
          <Card style={{ flexGrow: 1 }}>
            <Text fw={200}>{t.planets.totalResidents}</Text>
            <Text fw={400}>{users?.length ?? 0}</Text>
          </Card>
        }
      />
      <Space h={30} />
      {transactionsIsPending || usersIsPending ? (
        <Loading />
      ) : (
        <InfoTable
          list={filteredTransactions}
          columns={[
            { orderBy: true, label: t.transactions.table.id, key: "id" },
            { orderBy: true, label: t.transactions.table.from, key: "from" },
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
                <ClickableTd
                  tabIndex={0}
                  onClick={() => navigate(`/${lang}/users/${transaction.user}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(`/${lang}/users/${transaction.user}`);
                    }
                  }}
                >
                  {transaction.from}
                </ClickableTd>
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

const ClickableTd = styled(Table.Td)`
  cursor: pointer;

  &:hover {
    background-color: var(--mantine-color-blue-light-hover);
  }
`;

export default PlanetPage;
