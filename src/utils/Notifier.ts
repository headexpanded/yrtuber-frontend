import { NotifyCustomType } from 'boot/notify';
import { Notify } from 'quasar';

export type MessageOptions = Record<string, unknown>;

export type QNotifyAction = {
  icon: string;
  color: string;
  round: boolean;
};

export class Notifier {
  static #notify(
    type: string,
    messageKey: string,
    actions: QNotifyAction[] = [],
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
      message: messageKey, // Assuming messageKey is already localized
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
