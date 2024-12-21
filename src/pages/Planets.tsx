import { Loader, NumberFormatter, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getPlanets } from "api";
import { useAppContext } from "AppContext";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlanetsPage: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  // const [search, setSearch] = useState("");

  const { isPending, data: planets } = useQuery({
    queryKey: ["planets"],
    queryFn: getPlanets,
  });

  return (
    <div>
      <Text component="h1" fw={200} size="xl">
        {t.planets.title}
      </Text>
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
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t.planets.table.name}</Table.Th>
              <Table.Th>{t.planets.table.residents}</Table.Th>
              <Table.Th>{t.planets.table.population}</Table.Th>
              <Table.Th>{t.planets.table.climate}</Table.Th>
              <Table.Th>{t.planets.table.terrain}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {planets?.map((planet) => (
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
