"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export const EditableCell = ({
  value,
  onChange,
}: {
  value: string;
  onChange?: (val: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(tempValue);
    }
  };

  return (
    <div onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <Input
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBlur();
            }
          }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};
