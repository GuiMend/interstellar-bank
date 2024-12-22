import { Flex, NumberFormatter, Space, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getPlanets } from "api";
import { useAppContext } from "AppContext";
import ClearFilters from "components/ClearFilters";
import Loading from "components/Loading";
import Searchbar from "components/Searchbar";
import SingleSelectFilter from "components/SingleSelectFilter";
import InfoTable, { Order } from "components/Table";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PlanetsPage: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const climate = searchParams.get("climate") ?? "";
  const terrain = searchParams.get("terrain") ?? "";
  const orderName = (searchParams.get("name") ?? "") as Order;
  const orderResidents = (searchParams.get("residents") ?? "") as Order;

  const { isPending, data: planets } = useQuery({
    queryKey: ["planets"],
    queryFn: getPlanets,
  });

  const filteredPlanets = useMemo(() => {
    return planets
      ?.filter((planet) =>
        planet.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((planet) => {
        if (climate === "") return true;
        return planet.climate === climate;
      })
      .filter((planet) => {
        if (terrain === "") return true;
        return planet.terrain.includes(terrain);
      })
      .sort((a, b) => {
        if (!orderResidents) return 0;

        return orderResidents === "asc"
          ? b.residents.length - a.residents.length
          : a.residents.length - b.residents.length;
      })
      .sort((a, b) => {
        if (!orderName) return 0;

        return orderName === "asc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      });
  }, [climate, orderName, orderResidents, planets, search, terrain]);

  return (
    <div>
      <Flex justify="space-between">
        <Text component="h1" fw={200} size="xl" style={{ minHeight: 36 }}>
          {t.planets.title}
        </Text>
        {(search || orderName || orderResidents || terrain || climate) && (
          <ClearFilters />
        )}
      </Flex>
      <Space h={10} />
      <Searchbar placeholder={t.planets.title.toLowerCase()} />
      <Space h={10} />
      <Flex gap={16}>
        <SingleSelectFilter
          label={t.planets.selectClimate}
          selectId="climate"
          options={[
            {
              value: "arid",
              label: "Arid",
            },
            {
              value: "temperate",
              label: "Temperate",
            },
          ]}
        />
        <SingleSelectFilter
          label={t.planets.selectTerrain}
          selectId="terrain"
          options={[
            {
              value: "grasslands",
              label: "Grasslands",
            },
            {
              value: "mountains",
              label: "Mountains",
            },
            {
              value: "jungle",
              label: "Jungle",
            },
            {
              value: "rainforests",
              label: "Rainforests",
            },
          ]}
        />
      </Flex>
      <Space h={30} />
      {isPending ? (
        <Loading />
      ) : (
        <InfoTable
          list={filteredPlanets}
          columns={[
            { orderBy: true, key: "name", label: t.planets.table.name },
            {
              orderBy: true,
              key: "residents",
              label: t.planets.table.residents,
            },
            {
              label: t.planets.table.population,
              key: "population",
            },
            { label: t.planets.table.climate, key: "climate" },
            { label: t.planets.table.terrain, key: "terrain" },
          ]}
          row={(planet) => (
            <>
              <Table.Td>{planet.name}</Table.Td>
              <Table.Td>{planet.residents.length}</Table.Td>
              <Table.Td>
                {parseInt(planet.population) ? (
                  <NumberFormatter
                    value={planet.population}
                    thousandSeparator
                  />
                ) : (
                  "unknown"
                )}
              </Table.Td>
              <Table.Td style={{ textTransform: "capitalize" }}>
                {planet.climate}
              </Table.Td>
              <Table.Td style={{ textTransform: "capitalize" }}>
                {planet.terrain}
              </Table.Td>
            </>
          )}
          rowConfig={(planet) => ({
            key: planet.id,
            onClick: () => navigate(planet.id),
          })}
          translation={t.planets}
        />
      )}
    </div>
  );
};

export default PlanetsPage;
