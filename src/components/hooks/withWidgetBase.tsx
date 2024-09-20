// components/hooks/withWidgetBase.tsx

import React from "react";
import WidgetBase from "../WidgetBase";
import {
  WidgetProps,
  WidgetComponentProps,
  WidgetConfig,
} from "../../interfaces/widget";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";

function withWidgetBase<T extends WidgetConfig>({
  renderWidget,
  renderOptions,
  defaultConfig,
  widgetStyleConfig,
}: WidgetComponentProps<T>) {
  return function WidgetWithBase({
    id,
    editMode,
  }: {
    id: string;
    editMode: boolean;
  }) {
    const [config, setConfig] = useLocalStorage(
      `widget_${id}_config`,
      defaultConfig
    );

    const handleConfigChange = (newConfig: Partial<T>) => {
      setConfig((prevConfig: any) => ({ ...prevConfig, ...newConfig }));
    };

    const widgetProps: WidgetProps<T> = {
      id,
      editMode,
      config: { ...defaultConfig, ...config },
      onConfigChange: handleConfigChange,
    };

    const [widgetConfig, updateWidgetConfig] = useWidgetConfig(widgetProps);

    return (
      <WidgetBase
        widgetId={id}
        {...widgetStyleConfig}
        settings={
          renderOptions
            ? renderOptions({
                ...widgetProps,
                config: widgetConfig,
                onConfigChange: updateWidgetConfig,
              })
            : null
        }
      >
        {renderWidget({
          ...widgetProps,
          config: widgetConfig,
          onConfigChange: updateWidgetConfig,
        })}
      </WidgetBase>
    );
  };
}

export default withWidgetBase;
