import { Card, NumberFormatter, SimpleGrid, Text } from "@mantine/core";
import { LanguageType, useAppContext } from "AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Planet, User } from "server";
import styled from "styled-components";

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
      <SimpleGrid cols={{ lg: 8, md: 6, sm: 4, base: 2 }} spacing="md">
        {details.map(({ onClick, ...detail }) => {
          const value = parseFloat(detail.value ?? "");
          return (
            <Item
              key={detail.label}
              onClick={onClick}
              $isClickable={!!onClick}
              {...(!!onClick && {
                role: "button",
                tabIndex: 0,
                onKeyDown: (event) => {
                  if (event.key === "Enter") {
                    onClick();
                  }
                },
                ariaLabel: detail.label,
              })}
            >
              <Text fw={200}>{detail.label}</Text>
              <Text fw={400} style={{ textTransform: "capitalize" }}>
                {value ? (
                  <NumberFormatter value={value} thousandSeparator />
                ) : (
                  detail.value
                )}
              </Text>
            </Item>
          );
        })}
      </SimpleGrid>
    </Card>
  );
};

const Item = styled.div<{ $isClickable: boolean }>`
  ${({ $isClickable }) =>
    $isClickable &&
    `
  border-radius: 4px;
  cursor: pointer;
  padding: 6px;
  margin: -6px;
  &:hover {
    background-color: var(--mantine-color-blue-light-hover);
  }

`}
`;

export default UserDetails;
