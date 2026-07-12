export interface OpenWindowState {
  label: string;
  routeName: string;
  defaultWidth: number;
  defaultHeight: number;
}

export interface OpenWindowApi {
  label: string;
  posX: number;
  posY: number;
  routeName: string;
  width: number;
  height: number;
}
