import { Chip } from "@mantine/core";
import { IconProgress, IconX } from "@tabler/icons-react";
import { useAppContext } from "AppContext";

type Status = "completed" | "inProgress" | "blocked";

const StatusChip = ({ status }: { status: string }) => {
  const { t } = useAppContext();

  const chipConfig = {
    size: "xs",
    variant: "light",
    checked: true,
  } as const;

  switch (status) {
    case "completed":
      return (
        <Chip color="green" {...chipConfig}>
          {t.status.completed}
        </Chip>
      );
    case "inProgress":
      return (
        <Chip
          icon={<IconProgress height={10} width={10} />}
          color="blue"
          {...chipConfig}
        >
          {t.status.inProgress}
        </Chip>
      );
    case "blocked":
      return (
        <Chip
          icon={<IconX height={10} width={10} />}
          color="red"
          {...chipConfig}
        >
          {t.status.blocked}
        </Chip>
      );
    default:
      return <span>{status}</span>;
  }
};

export default StatusChip;
export type { Status };
