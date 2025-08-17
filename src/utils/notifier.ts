import { Notify } from 'quasar';

export type MessageOptions = Record<string, unknown>;
export type QNotifyAction = {
  icon: string;
  color: string;
  round: boolean;
};

export enum NotifyCustomType {
  QuickPositive = 'positive',
  QuickNegative = 'negative',
  QuickWarning = 'warning',
  QuickInfo = 'info',
}

export class Notifier {
  static #notify(
    type: string,
    messageKey: string,
    actions: QNotifyAction[] = []
  ) {
    const notifyActions =
      actions.length > 0
        ? actions
        : [
            {
              icon: 'close',
              color: 'white',
              round: true,
            },
          ];

    Notify.create({
      type,
      message: messageKey, // For now, using direct message until i18n is set up
      actions: notifyActions,
      classes: 'white-space-pre-line',
    });
  }

  static quickPositive(messageKey: string, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickPositive, messageKey, actions);
  }

  static quickNegative(messageKey: string, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickNegative, messageKey, actions);
  }

  static quickWarning(messageKey: string, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickWarning, messageKey, actions);
  }

  static quickInfo(messageKey: string, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickInfo, messageKey, actions);
  }
}
