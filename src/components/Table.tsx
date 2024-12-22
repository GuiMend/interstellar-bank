import { Center, Flex, Table, Text } from "@mantine/core";
import { Planets, Transactions, Users } from "languages/translation";
import { useSearchParams } from "react-router-dom";
import { currentQueryParams } from "utils/pathnames";

type Column = {
  label: string;
  orderBy?: boolean;
  key: string;
};

type InfoTableProps<T> = {
  translation: Planets | Transactions | Users;
  list?: T[];
  columns: Array<Column>;
  row: (item: T) => React.ReactNode;
  rowConfig: (item: T) => {
    key: string;
    onClick?: () => void;
  };
};

type Order = "asc" | "desc" | "";

function InfoTable<T>({
  list,
  row,
  columns,
  rowConfig,
  translation,
}: InfoTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Table.ScrollContainer minWidth={500}>
      <Table striped highlightOnHover withRowBorders={false}>
        {(list ?? [])?.length > 0 && (
          <Table.Caption>
            {list?.length} {translation.resultAmount}
          </Table.Caption>
        )}
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => {
              const keyOrder = searchParams.get(column.key);
              return (
                <Table.Th
                  key={column.label}
                  {...(column.orderBy && {
                    onClick: () => {
                      setSearchParams({
                        ...currentQueryParams(searchParams),
                        [column.key]: keyOrder === "asc" ? "desc" : "asc",
                      });
                    },
                    onKeyDown: (event) => {
                      if (event.key === "Enter") {
                        setSearchParams({
                          ...currentQueryParams(searchParams),
                          [column.key]: keyOrder === "asc" ? "desc" : "asc",
                        });
                      }
                    },
                    role: "button",
                    tabIndex: 0,
                    style: { cursor: "pointer" },
                  })}
                >
                  <Flex justify="space-between">
                    {column.label}
                    {keyOrder && (
                      <span>
                        {keyOrder === "asc"
                          ? "▲"
                          : keyOrder === "desc"
                          ? "▼"
                          : ""}
                      </span>
                    )}
                  </Flex>
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {list?.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Center>
                  <Text size="sm" fw={200}>
                    {translation.noResults}
                  </Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          )}
          {list?.map((item) => (
            <Table.Tr {...rowConfig(item)} style={{ cursor: "pointer" }}>
              {row(item)}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

export default InfoTable;
export type { InfoTableProps, Order };
