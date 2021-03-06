'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinMain = map.querySelector('.map__pin--main'); // метка, являющаяся контролом указания адреса объявления
  var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)'); // метки похожих объявлений на карте
  var card = map.querySelector('.map__card'); // карточка с данными объявления

  var filters = document.querySelector('.map__filters'); // форма с фильтрами
  var filterList = filters.querySelectorAll('select'); // список фильтров
  var houseTypeField = filters.querySelector('#housing-type'); // фильтр: тип жилья

  var form = window.form;
  var advertsData = [];

  /**
   * Переводит страницу в неактивное состояние (отключены форма и карта), выключает активный режим
   */
  var offActiveMode = function () {
    map.classList.add('map--faded');
    pinMain = map.querySelector('.map__pin--main');
    pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    card = map.querySelector('.map__card');
    form.form.classList.add('ad-form--disabled');

    filterList.forEach(function (filter) {
      filter.disabled = true;
    });

    form.form.reset();
    form.setFieldFormActiveOff();

    form.elementList.forEach(function (element) {
      element.disabled = true;
    });

    if (card) {
      window.card.close();
    }

    pins.forEach(function (pinElement) {
      pinElement.remove();
    });

    pinMain.style.left = window.util.pinMainStartCoords.x + 'px';
    pinMain.style.top = window.util.pinMainStartCoords.y + 'px';

    pinMain.addEventListener('mousedown', firstMouseDownHandler);
    pinMain.addEventListener('keydown', firstEnterHandler);
  };

  offActiveMode();

  /**
   * Обработчик успешной загрузки данных с сервера
   * @param {Array} data Массив с данными объявлений, полученный с сервера
   */
  var loadSuccessHandler = function (data) {
    advertsData = data;
    window.pin.render(advertsData);

    filterList.forEach(function (filter) {
      filter.disabled = false;
    });
  };

  /**
   * Обработчик ошибки, произошедшей при получении данных с сервера
   * @param {string} errorMessage Текст сообщения
   */
  var loadErrorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style.zIndex = 100;
    node.style.position = 'absolute';
    node.style.top = '25%';
    node.style.left = 0;
    node.style.right = 0;
    node.style.width = '300px';
    node.style.margin = '0 auto';
    node.style.padding = '25px 50px';
    node.style.fontSize = '21px';
    node.style.textAlign = 'center';
    node.style.color = '#ff5635';
    node.style.backgroundColor = 'white';
    node.style.boxShadow = '0 0 2px 2px #ff6547';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  /**
 * Включает активный режим, страница находится в активном состоянии: включены форма и карта
 */
  var onActiveMode = function () {
    map.classList.remove('map--faded');
    form.form.classList.remove('ad-form--disabled');

    form.elementList.forEach(function (element) {
      element.disabled = false;
    });

    form.setFieldFormActiveOn();

    // Получает данные с сервера при помощи объекта для работы с HTTP-запросами XMLHttpRequest
    window.load(loadSuccessHandler, loadErrorHandler);

    pinMain.removeEventListener('mousedown', firstMouseDownHandler);
    pinMain.removeEventListener('keydown', firstEnterHandler);
  };

  /**
   * Обработчик нажатия левой кнопки мыши на главной метке
   * @param {Object} evt Объект, описывающий событие, кот. произошло
   */
  var firstMouseDownHandler = function (evt) {
    window.util.isMouseDownEvent(evt, onActiveMode);
  };

  /**
   * Обработчик события нажатия клавиши Enter на главной метке
   * @param {Object} evt Объект, описывающий событие, кот. произошло
   */
  var firstEnterHandler = function (evt) {
    window.util.isEnterEvent(evt, onActiveMode);
  };

  pinMain.addEventListener('mousedown', firstMouseDownHandler);
  pinMain.addEventListener('keydown', firstEnterHandler);

  /*
   * Фильтры
   */
  houseTypeField.addEventListener('change', function () {
    pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    card = map.querySelector('.map__card');

    if (card) {
      window.card.close();
    }

    pins.forEach(function (pinElement) {
      pinElement.remove();
    });

    if (houseTypeField.value !== 'any') {
      var advertsSameHouseType = advertsData.filter(function (advert) {
        return advert.offer.type === houseTypeField.value;
      });

      if (advertsSameHouseType.length !== 0) {
        window.pin.render(advertsSameHouseType);
      }
    } else {
      window.pin.render(advertsData);
    }
  });

  // ---------------------------- Отправка данных формы на сервер ----------------------------
  /**
   * Закрывает сообщение, появляющееся после отправки формы
   */
  var closeMessage = function () {
    var successMessage = document.querySelector('.success');
    var errorMessage = document.querySelector('.error');

    if (successMessage) {
      successMessage.remove();
    }

    if (errorMessage) {
      errorMessage.remove();
    }

    document.removeEventListener('click', messageClickHandler);
    document.removeEventListener('keydown', messageEscHandler);
  };

  /**
   * Обработчик клика на произвольной области экрана для закрытия сообщения
   */
  var messageClickHandler = function () {
    window.util.isClickEvent(closeMessage);
  };

  /**
   * Обработчик нажатия клавиши Esc для закрытия сообщения
   * @param {Object} evt Объект, описывающий событие, кот. произошло
   */
  var messageEscHandler = function (evt) {
    window.util.isEscEvent(evt, closeMessage);
  };

  /**
   * Обработчик успешной отправки данных на сервер
   */
  var uploadSuccessHandler = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successMessage = successTemplate.cloneNode(true);
    var main = document.querySelector('main');

    main.appendChild(successMessage);

    document.addEventListener('click', messageClickHandler);
    document.addEventListener('keydown', messageEscHandler);

    offActiveMode();
  };

  /**
   * Обработчик ошибки, произошедшей при отправки данных на сервер
   */
  var uploadErrorHandler = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorMessage = errorTemplate.cloneNode(true);
    var main = document.querySelector('main');

    main.appendChild(errorMessage);

    var errorMessageButton = errorMessage.querySelector('.error__button');

    errorMessageButton.addEventListener('click', messageClickHandler);
    document.addEventListener('click', messageClickHandler);
    document.addEventListener('keydown', messageEscHandler);

    offActiveMode();
  };

  form.form.addEventListener('submit', function (evt) {
    var formData = new FormData(form.form); // объект, представляющий данные HTML формы

    // Передаёт данные формы на сервер при помощи объекта для работы с HTTP-запросами XMLHttpRequest
    window.upload(formData, uploadSuccessHandler, uploadErrorHandler);
    evt.preventDefault(); // чтобы отправка формы не обновила страницу
  });

  form.resetForm.addEventListener('click', function (evt) {
    evt.preventDefault();

    form.form.reset();
    form.setFieldFormActiveOn();

    pinMain.style.left = window.util.pinMainStartCoords.x + 'px';
    pinMain.style.top = window.util.pinMainStartCoords.y + 'px';
  });
})();
