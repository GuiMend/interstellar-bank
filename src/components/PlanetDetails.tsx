import { Card, NumberFormatter, SimpleGrid, Text } from "@mantine/core";
import { useAppContext } from "AppContext";
import { Planet } from "server";

type PlanetDetailsProps = {
  planet: Planet;
};

const PlanetDetails = ({ planet }: PlanetDetailsProps) => {
  const { t } = useAppContext();

  const details = [
    { label: t.planets.table.population, value: planet?.population },
    { label: t.planets.table.climate, value: planet?.climate },
    { label: t.planets.table.terrain, value: planet?.terrain },
    { label: t.planets.table.rotationPeriod, value: planet?.rotation_period },
    { label: t.planets.table.gravity, value: planet?.gravity },
    { label: t.planets.table.orbitalPeriod, value: planet?.orbital_period },
    { label: t.planets.table.diameter, value: planet?.diameter },
    { label: t.planets.table.surfaceWater, value: planet?.surface_water },
  ];

  return (
    <Card>
      <SimpleGrid cols={{ lg: 8, md: 6, sm: 4, base: 2 }} spacing="sm">
        {details.map((detail) => {
          const value = parseFloat(detail.value ?? "");
          return (
            <div key={detail.label}>
              <Text fw={200}>{detail.label}</Text>
              <Text fw={400} style={{ textTransform: "capitalize" }}>
                {value ? (
                  <NumberFormatter value={value} thousandSeparator />
                ) : (
                  detail.value
                )}
              </Text>
            </div>
          );
        })}
      </SimpleGrid>
    </Card>
  );
};

export default PlanetDetails;
