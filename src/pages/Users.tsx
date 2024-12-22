import { Flex, Space, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "api";
import { useAppContext } from "AppContext";
import ClearFilters from "components/ClearFilters";
import Loading from "components/Loading";
import Searchbar from "components/Searchbar";
import InfoTable, { Order } from "components/Table";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const rowItemStyles = {
  textTransform: "capitalize",
} as const;

const UsersPage: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const orderName = (searchParams.get("name") ?? "") as Order;

  const { isPending, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const filteredUsers = useMemo(() => {
    return users
      ?.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (!orderName) return 0;

        return orderName === "asc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      });
  }, [orderName, users, search]);

  return (
    <div>
      <Flex justify="space-between">
        <Text component="h1" fw={200} size="xl" style={{ minHeight: 36 }}>
          {t.users.title}
        </Text>
        {(search || orderName) && <ClearFilters />}
      </Flex>
      <Space h={10} />
      <Searchbar placeholder={t.users.title.toLowerCase()} />
      <Space h={30} />
      {isPending ? (
        <Loading />
      ) : (
        <InfoTable
          list={filteredUsers}
          columns={[
            { orderBy: true, key: "name", label: t.users.table.name },
            { key: "gender", label: t.users.table.gender },
            { key: "birthYear", label: t.users.table.birthYear },
            { key: "height", label: t.users.table.height },
          ]}
          row={(user) => (
            <>
              <Table.Td style={rowItemStyles}>{user.name}</Table.Td>
              <Table.Td style={rowItemStyles}>{user.gender}</Table.Td>
              <Table.Td style={rowItemStyles}>{user.birth_year}</Table.Td>
              <Table.Td>{user.height}</Table.Td>
            </>
          )}
          rowConfig={(user) => ({
            key: user.id,
            onClick: () => navigate(user.id),
          })}
          translation={t.users}
        />
      )}
    </div>
  );
};

export default UsersPage;
