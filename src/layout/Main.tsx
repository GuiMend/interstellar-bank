import {
  ActionIcon,
  Anchor,
  AppShell,
  Burger,
  Center,
  Checkbox,
  Group,
  NavLink,
  Space,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlanet, IconUser } from "@tabler/icons-react";
import { LANGUAGE, LanguageType, useAppContext } from "AppContext";
import DarkIcon from "assets/death-star-dark.png";
import LightIcon from "assets/death-star-light.png";
import Logo from "assets/logo.png";
import ExchangeRate from "components/ExchangeRate";
import { useEffect } from "react";
import {
  Link,
  Outlet,
  NavLink as RouterNavLink,
  useLocation,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { getCurrentLocation } from "utils/pathnames";

const MainLayout = () => {
  const { lang = LANGUAGE.EN } = useParams<{ lang: LanguageType }>();
  const { pathname } = useLocation();
  const {
    colorScheme,
    toggleColorScheme,
    t,
    updateLanguage,
    showProVersion,
    setShowProVersion,
  } = useAppContext();
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (lang && Object.values(LANGUAGE).includes(lang)) {
      updateLanguage?.(lang);
    }
  }, [lang, updateLanguage]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 195, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" justify="space-between" px="md">
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <LogoWrapper src={Logo} alt="Interstellar Bank Logo" />
            <Text size="xl" fw={200}>
              {t.app}
            </Text>
          </Group>
          <ActionIcon
            onClick={toggleColorScheme}
            aria-label="Switch theme color"
            variant="light"
            size="xl"
            radius="xl"
            {...(colorScheme === "dark" && {
              color: "rgba(255, 255, 255, 1)",
            })}
          >
            {colorScheme === "light" ? (
              <img src={DarkIcon} alt="moon" height={30} width={30} />
            ) : (
              <img src={LightIcon} alt="moon" height={30} width={30} />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar withBorder={false}>
        <AppShell.Section grow my="md" px="xs">
          <NavLink
            component={RouterNavLink}
            to="planets"
            label={t.planets.nav}
            {...(showProVersion && {
              leftSection: <IconPlanet size={14} />,
            })}
          />
          <NavLink
            component={RouterNavLink}
            to="users"
            label={t.users.nav}
            {...(showProVersion && {
              leftSection: <IconUser size={14} />,
            })}
          />
        </AppShell.Section>
        <AppShell.Section p="xs">
          <ExchangeRate />
          <Space h="md" />
          <Center>
            <Checkbox
              label="Pro version"
              checked={!!showProVersion}
              onChange={(event) =>
                setShowProVersion?.(event.currentTarget.checked)
              }
            />
          </Center>
          <Space h="md" />
          <LanguagesWrapper>
            {Object.entries(LANGUAGE).map(([key, value]) => {
              const urlEnd = getCurrentLocation(pathname, lang);

              if (value === lang) return <Text key={key}>{key}</Text>;

              return (
                <Anchor key={key} component={Link} to={`/${value}${urlEnd}`}>
                  {key}
                </Anchor>
              );
            })}
          </LanguagesWrapper>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

const LogoWrapper = styled.img`
  height: 45px;
  width: 45px;
  margin-right: 8px;
  border-radius: 50%;
`;

const LanguagesWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  & > *:not(:last-child)::after {
    content: "•";
    margin-left: 8px;
    color: var(--mantine-color-text);
    text-decoration: none;
  }

  & > *:not(:last-child):hover::after {
    text-decoration: none;
  }
`;

export default MainLayout;
