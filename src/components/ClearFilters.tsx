import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useAppContext } from "AppContext";
import { useSearchParams } from "react-router-dom";

const ClearFilters = () => {
  const { t } = useAppContext();
  const [, setSearchParams] = useSearchParams();
  return (
    <Button
      leftSection={<IconX size={14} />}
      variant="default"
      onClick={() => setSearchParams()}
    >
      {t.clearFilters}
    </Button>
  );
};

export default ClearFilters;
