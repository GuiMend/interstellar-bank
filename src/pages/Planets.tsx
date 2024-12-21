import {
  Button,
  Center,
  Flex,
  Loader,
  NumberFormatter,
  Space,
  Table,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getPlanets } from "api";
import { useAppContext } from "AppContext";
import Searchbar from "components/Searchbar";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { currentQueryParams } from "utils/pathnames";

const PlanetsPage: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const order = searchParams.get("order") ?? "";

  const { isPending, data: planets } = useQuery({
    queryKey: ["planets"],
    queryFn: getPlanets,
  });

  const filteredPlanets = useMemo(() => {
    return planets
      ?.filter((planet) =>
        planet.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (!order) return 0;

        return order.includes("-")
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      });
  }, [order, planets, search]);

  return (
    <div>
      <Flex justify="space-between">
        <Text component="h1" fw={200} size="xl">
          {t.planets.title}
        </Text>
        {(search || order) && (
          <Button
            leftSection={<IconX size={14} />}
            variant="default"
            onClick={() => setSearchParams()}
          >
            {t.clearFilters}
          </Button>
        )}
      </Flex>
      <Space h={10} />
      <Searchbar placeholder={t.planets.title.toLowerCase()} />
      <Space h={30} />
      {isPending ? (
        <Loader />
      ) : (
        <Table
          striped
          highlightOnHover
          withRowBorders={false}
          stickyHeader
          stickyHeaderOffset={60}
        >
          {(filteredPlanets ?? [])?.length > 0 && (
            <Table.Caption>
              {filteredPlanets?.length} {t.planets.resultAmount}
            </Table.Caption>
          )}
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                onClick={() => {
                  setSearchParams({
                    ...currentQueryParams(searchParams),
                    order: order === "name" ? "-name" : "name",
                  });
                }}
              >
                <Flex justify="space-between" style={{ cursor: "pointer" }}>
                  {t.planets.table.name}
                  <span>
                    {
                      {
                        name: "▲",
                        "-name": "▼",
                        "": "",
                      }[order]
                    }
                  </span>
                </Flex>
              </Table.Th>
              <Table.Th>{t.planets.table.residents}</Table.Th>
              <Table.Th>{t.planets.table.population}</Table.Th>
              <Table.Th>{t.planets.table.climate}</Table.Th>
              <Table.Th>{t.planets.table.terrain}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPlanets?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center>
                    <Text size="sm" fw={200}>
                      {t.planets.noResults}
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
            {filteredPlanets?.map((planet) => (
              <Table.Tr key={planet.id} onClick={() => navigate(planet.id)}>
                <Table.Td>{planet.name}</Table.Td>
                <Table.Td>{planet.residents.length}</Table.Td>
                <Table.Td>
                  {parseInt(planet.population) ? (
                    <NumberFormatter
                      value={planet.population}
                      thousandSeparator
                    />
                  ) : (
                    "?"
                  )}
                </Table.Td>
                <Table.Td>{planet.climate}</Table.Td>
                <Table.Td>{planet.terrain}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </div>
  );
};

export default PlanetsPage;
