import { Notify } from "quasar";

export enum NotifyCustomType {
  QuickPositive = "quick-positive",
  QuickWarning = "quick-warning",
  QuickInfo = "quick-info",
  QuickNegative = "quick-negative",
}

Notify.registerType(NotifyCustomType.QuickPositive, {
  icon: "check_circle",
  progress: true,
  timeout: 1000,
  position: "top-right",
  color: "positive",
  textColor: "white",
  iconColor: "white",
});

Notify.registerType(NotifyCustomType.QuickWarning, {
  icon: "warning",
  progress: true,
  timeout: 1000,
  position: "top-right",
  color: "warning",
  textColor: "dark",
  iconColor: "dark",
});

Notify.registerType(NotifyCustomType.QuickInfo, {
  icon: "info",
  progress: true,
  timeout: 1000,
  position: "top-right",
  color: "info",
  textColor: "dark",
  iconColor: "dark",
});

Notify.registerType(NotifyCustomType.QuickNegative, {
  icon: "error",
  progress: true,
  timeout: 1000,
  position: "top-right",
  color: "negative",
  textColor: "white",
  iconColor: "white",
});
