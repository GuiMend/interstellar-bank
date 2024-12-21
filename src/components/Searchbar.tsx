import { LineChart } from "@mantine/charts";
import { Card, Center, Input, Loader, Paper, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "api";
import { useAppContext } from "AppContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { currentQueryParams } from "utils/pathnames";

type SearchBarProps = {
  placeholder: string;
};

const Searchbar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const { t, showProVersion } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Input
      placeholder={`${t.search} ${placeholder}`}
      {...(showProVersion && {
        leftSection: <IconSearch size={16} />,
      })}
      value={searchParams.get("q") || ""}
      onChange={(event) =>
        setSearchParams({
          ...currentQueryParams(searchParams),
          q: event.currentTarget.value,
        })
      }
    />
  );
};

export default Searchbar;
