import { IconChevronDown } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { currentQueryParams } from "utils/pathnames";

type SingleSelectFilterProps = {
  label: string;
  placeholder?: string;
  selectId: string;
  options: Array<{
    value: string;
    label: string;
  }>;
};

const SingleSelectFilter = ({
  label,
  placeholder,
  selectId,
  options,
}: SingleSelectFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(selectId) ?? "";

  return (
    <Wrapper>
      <Label htmlFor={selectId}>{label}:</Label>
      <SelectWrapper>
        <Icon>
          <IconChevronDown height={16} width={16} />
        </Icon>
        <Select
          id={selectId}
          value={value}
          onChange={(event) => {
            setSearchParams({
              ...currentQueryParams(searchParams),
              [selectId]: event.target.value,
            });
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </SelectWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
`;

const SelectWrapper = styled.div`
  position: relative;
  background-color: var(--mantine-color-default);
`;

const Icon = styled.div`
  /* Click through icon (so that <select> handles click) */
  pointer-events: none;
  position: absolute;
  right: 5px;
  top: 8px;
`;

const Select = styled.select`
  height: 34px;
  min-width: 100px;
  padding: 0px 24px 0 12px;
  border-radius: 4px;
  appearance: none;
  background: transparent;
  color: var(--mantine-color-text);
  border: 1px solid var(--app-shell-border-color);

  &:focus {
    border: 1px solid var(--mantine-primary-color-filled);
    outline: none;
  }
`;

export default SingleSelectFilter;
