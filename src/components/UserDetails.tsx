import { Card, NumberFormatter, SimpleGrid, Text } from "@mantine/core";
import { LanguageType, useAppContext } from "AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Planet, User } from "server";

type UserDetailsProps = {
  user: User;
  homeworld: Planet;
};

const UserDetails = ({ user, homeworld }: UserDetailsProps) => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const { lang = "en" } = useParams<{
    lang: LanguageType;
  }>();

  const details = [
    {
      label: t.users.table.homeworld,
      value: homeworld?.name,
      onClick: () => {
        navigate(`/${lang}/planets/${homeworld.id}`);
      },
      styles: { cursor: "pointer" },
    },
    { label: t.users.table.gender, value: user?.gender },
    { label: t.users.table.birthYear, value: user?.birth_year },
    { label: t.users.table.height, value: user?.height },
    { label: t.users.table.mass, value: user?.mass },
    { label: t.users.table.hairColor, value: user?.hair_color },
    { label: t.users.table.skinColor, value: user?.skin_color },
    { label: t.users.table.eyeColor, value: user?.eye_color },
  ];

  return (
    <Card>
      <SimpleGrid cols={{ lg: 8, md: 6, sm: 4, base: 2 }} spacing="sm">
        {details.map(({ onClick, styles, ...detail }) => {
          const value = parseFloat(detail.value ?? "");
          return (
            <div key={detail.label} onClick={onClick} style={styles}>
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

export default UserDetails;
