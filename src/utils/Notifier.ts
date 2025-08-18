import { NotifyCustomType } from 'boot/notify';
import { Notify } from 'quasar';
import { i18n } from "boot/i18n";

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
    messageOptions: MessageOptions = {},
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
      message: i18n.global.t(messageKey, messageOptions),
      actions: notifyActions,
      classes: 'white-space-pre-line',
    });
  }

  static quickPositive(messageKey: string, messageOptions: MessageOptions = {}, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickPositive, messageKey, messageOptions, actions);
  }

  static quickNegative(messageKey: string, messageOptions: MessageOptions = {}, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickNegative, messageKey, messageOptions, actions);
  }

  static quickWarning(messageKey: string, messageOptions: MessageOptions = {}, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickWarning, messageKey, messageOptions, actions);
  }

  static quickInfo(messageKey: string, messageOptions: MessageOptions = {}, actions: QNotifyAction[] = []) {
    this.#notify(NotifyCustomType.QuickInfo, messageKey, messageOptions, actions);
  }
}
