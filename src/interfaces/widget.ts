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
}
