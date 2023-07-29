export interface Widget {
  id: number;
  name: string;
  isFixed: boolean;
  isInstallChildren: boolean;
  subWidgets: Widget[];
}
