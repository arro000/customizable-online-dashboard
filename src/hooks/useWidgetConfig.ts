// hooks/useWidgetConfig.ts

import { useState, useCallback } from "react";
import { WidgetConfig, WidgetProps } from "../interfaces/widget";

export function useWidgetConfig<T>(props: WidgetProps<T>) {
  const [localConfig, setLocalConfig] = useState(props.config);

  const updateConfig = useCallback(
    (updater: Partial<T> | ((prev: T) => Partial<T>)) => {
      const newPartialConfig =
        typeof updater === "function" ? updater(localConfig) : updater;
      const newConfig = { ...localConfig, ...newPartialConfig };
      setLocalConfig(newConfig);
      props.onConfigChange(newPartialConfig);
    },
    [localConfig, props.onConfigChange]
  );

  return [localConfig, updateConfig] as const;
}
