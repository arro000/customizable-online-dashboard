import { ReactNode } from "react";
import * as Components from "../components/widgets/index";

export interface WidgetData {
  id: string;
  type: string;
  width: number;
  height: number;
}

export interface WidgetElementBaseProp {
  editMode: boolean;
}

export interface WidgetConfig {
  id: string;

  i: string;
  x: number;
  y: number;
  w: number;
  h: number;

  component: keyof typeof Components;
  props?: Record<string, any>;
  [key: string]: any;
}

export interface WidgetProps<T> {
  id: string;
  editMode: boolean;
  config: T;
  onConfigChange: (newConfig: Partial<T>) => void;
}

export interface WidgetComponentProps<T extends WidgetConfig = WidgetConfig> {
  renderWidget: (props: WidgetProps<T>) => React.ReactNode;
  renderOptions: (props: WidgetProps<T>) => React.ReactNode;
  defaultConfig: T;
  widgetStyleConfig?: {
    bg: string;
    borderColor:string;
  }
}
