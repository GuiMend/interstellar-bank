import { Alert } from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconCheck,
  IconInfoCircle,
  IconXboxXFilled,
} from "@tabler/icons-react";
import { useAppContext } from "AppContext";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const ALERT_TYPE = {
  success: {
    icon: <IconCheck />,
    color: "teal",
  },
  error: {
    icon: <IconXboxXFilled />,
    color: "red",
  },
  warning: {
    icon: <IconAlertTriangleFilled />,
    color: "yellow",
  },
  info: {
    icon: <IconInfoCircle />,
    color: "blue",
  },
};

const GlobalAlert = () => {
  const [animateOut, setAnimateOut] = useState(false);
  const { showGlobalAlert, globalAlertContent, updateGlobalAlert } =
    useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateGlobalAlert?.(undefined);
    }, 1300);

    const animateTimeout = setTimeout(() => {
      setAnimateOut(true);
    }, 1150);

    return () => {
      clearTimeout(timeout);
      clearTimeout(animateTimeout);
    };
  }, [globalAlertContent, updateGlobalAlert]);

  if (
    !showGlobalAlert ||
    !globalAlertContent?.title ||
    !globalAlertContent?.type
  )
    return null;

  return (
    <Wrapper $animateOut={animateOut}>
      <Alert
        variant="light"
        title={globalAlertContent.title}
        {...ALERT_TYPE[globalAlertContent.type]}
      >
        {globalAlertContent?.message}
      </Alert>
    </Wrapper>
  );
};

const slideIn = keyframes`
  from {
    transform: translateX(110%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(110%);
  }
`;

const Wrapper = styled.div<{ $animateOut: boolean }>`
  z-index: 1000;
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: var(--mantine-color-default);
  animation: ${({ $animateOut }) => ($animateOut ? slideOut : slideIn)} 0.5s
    forwards;
`;

export default GlobalAlert;
