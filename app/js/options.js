(($, chrome) => {
  class Options {
    constructor() {
      // エレメントの取得
      this.$container = $('#fn-options-container');
      this.$name = $('#space_name');
      this.$tld = $('#space_tld');
      this.$key = $('#space_key');
      this.$close = $('#auto_close');
      this.$btn = $('#fn-options-submit');

      this._error = false;
      this.init();

      this.$btn.on('click', this.saveToStorage.bind(this));
      this.$name.on('change', this.fieldValidate.bind(this, /^[0-9a-zA-Z\-\_]+?$/));
      this.$tld.on('change', this.fieldValidate.bind(this, /^[a-z]+?$/));
      this.$key.on('change', this.fieldValidate.bind(this, /^[0-9a-zA-Z\-\_]+?$/));
    }

    get error() {
      return this._error;
    }
    set error(value) {
      this._error = value;
      this.updateBtnStatus();
    }

    /**
     * 初期表示処理
     */
    init() {
      // ストレージに値が入っていたら反映する
      chrome.storage.sync.get(['backlog_name', 'backlog_tld', 'backlog_key', 'notification_seconds'], (value) => {
        if (!value.backlog_name || !value.backlog_tld || !value.backlog_key) {
          return;
        }
        this.$name.val(value.backlog_name);
        this.$tld.val(value.backlog_tld);
        this.$key.val(value.backlog_key);
        this.$close.find('option').filter(`[value="${value.notification_seconds}"]`).prop('selected', true);
        this.updateBtnStatus();
      });
      this.updateBtnStatus();
    }

    /**
     * ストレージへの保存
     */
    saveToStorage() {
      const value = {
        backlog_name: this.$name.val(),
        backlog_tld: this.$tld.val(),
        backlog_key: this.$key.val(),
        notification_seconds: this.$close.val()
      };

      this.$container.find('.c-txt-error').remove();

      // AUTHチェック
      this.checkAuth(`https://${value.backlog_name}.backlog.${value.backlog_tld}/api/v2/space?apiKey=${value.backlog_key}`)
        .then((payload) => {
          chrome.storage.sync.set(value, () => {});
          this.$container.prepend('<p class="c-txt-completed">登録しました！</p>');

          // お知らせ件数取得
          this.getNotificationLength(`https://${value.backlog_name}.backlog.${value.backlog_tld}/api/v2/notifications/count?apiKey=${value.backlog_key}`)
            .then((result) => {
              chrome.storage.sync.set(result, () => {});
            });
        }, (reject) => {
          this.$container.prepend('<p class="c-txt-error">接続できませんでした。スペース名とAPI KEYを再度確かめてください。</p>');
        });
    }

    /**
     * 登録時のお知らせ件数の取得
     */
    getNotificationLength(url) {
      return new Promise((resolve) => {
        fetch(url)
          .then((result) => {
            resolve(result.json());
          });
      });
    }

    /**
     * バリデート
     */
    fieldValidate(regex, e) {
      const target = $(e.currentTarget);
      const value = target.val();
      if (!regex.test(value)) {
        this.error = true;
      } else {
        this.error = false;
      }
      this.updateField(target);
    }

    /**
     * AUTHチェック
     * @param {string} url
     */
    checkAuth(url) {
      return new Promise((resolve, reject) => {
        fetch(url)
          .then((result) => {
            if (!result.ok) {
              throw Error(result.statusText);
            }
            return result;
          })
          .then((result) => {
            resolve(result.json());
          })
          .catch((result) => {
            reject(result);
          });
      });
    }


    /**
     * フィールドのアップデート
     */
    updateField(el) {
      if (this.error) {
        if (el.parents('td').find('.c-form-error').length) {
          return;
        }
        el.addClass('is-error');
        el.parents('td').append('<p class="c-form-error">入力に誤りがあります。修正してください。</p>')
        return;
      }
      el.removeClass('is-error');
      el.parents('td').find('.c-form-error').remove();
    }


    /**
     * ボタンのアップデート
     */
    updateBtnStatus() {
      let disabled = false;

      if (!this.$name.val() || !this.$key.val() || this.error) {
        disabled = true;
      }

      this.$btn.prop('disabled', disabled);
    }
  }

  const options = new Options();
})(window.jQuery, window.chrome);
