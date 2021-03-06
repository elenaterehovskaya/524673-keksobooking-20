'use strict';

(function () {
  var form = document.querySelector('.ad-form'); // форма подачи заявления
  var elementList = form.querySelectorAll('fieldset'); // список элементов формы подачи заявления
  var price = form.querySelector('#price'); // поле цены за ночь
  var address = form.querySelector('#address'); // поле адреса
  var type = form.querySelector('#type'); // поле тип жилья
  var timeIn = form.querySelector('#timein'); // поле время заезда
  var timeOut = form.querySelector('#timeout'); // поле время выезда
  var rooms = form.querySelector('#room_number'); // поле количества комнат
  var guests = form.querySelector('#capacity'); // поле количества гостей (спальных мест)

  var resetForm = form.querySelector('.ad-form__reset'); // кнопка очистки формы

  /**
   * Указывает желательное минимальное значение в поле «Цена за ночь» в зависимости от выбранного типа жилья
   */
  var changePriceMin = function () {
    switch (type.value) {
      case 'bungalo':
        price.placeholder = '0';
        break;
      case 'flat':
        price.placeholder = '1000';
        break;
      case 'house':
        price.placeholder = '5000';
        break;
      case 'palace':
        price.placeholder = '10000';
        break;
    }

    price.min = parseInt(price.placeholder, 10);
  };

  type.addEventListener('change', function () {
    changePriceMin();
  });

  /**
   * Проверяет максимальное значение, введённое пользователем в поле «Цена за ночь»
   */
  var checkPriceMax = function () {
    var userPrice = parseInt(price.value, 10);
    price.setCustomValidity('');

    if (userPrice > 1000000) {
      price.setCustomValidity('Максимальное значение цены за ночь 1 000 000 руб.');
    }
  };

  price.addEventListener('change', function () {
    checkPriceMax();
  });

  /**
   * Проверяет соответствие поля «Время заезда» полю «Время выезда»
   */
  var checkTimeIn = function () {
    timeOut.value = timeIn.value;
  };

  /**
   * Проверяет соответствие поля «Время выезда» полю «Время заезда»
   */
  var checkTimeOut = function () {
    timeIn.value = timeOut.value;
  };

  timeIn.addEventListener('change', function () {
    checkTimeIn();
  });

  timeOut.addEventListener('change', function () {
    checkTimeOut();
  });

  /**
   * Проверяет соответствие значения в поле «Количество мест» значению в поле «Количество комнат»
   * @param {number} userRooms Число комнат, выбранных пользователем
   */
  var checkGuests = function (userRooms) {
    var userGuests = parseInt(guests.value, 10);
    guests.setCustomValidity('');

    if (userRooms === 1) {
      if (userGuests !== 1) {
        guests.setCustomValidity('Число гостей в одной комнате может быть только 1');
      }
    }
    if (userRooms === 2) {
      if (userGuests !== 1 && userGuests !== 2) {
        guests.setCustomValidity('Число гостей в двух комнатах может быть 2 или 1');
      }
    }
    if (userRooms === 3) {
      if (userGuests !== 1 && userGuests !== 2 && userGuests !== 3) {
        guests.setCustomValidity('Число гостей в трёх комнатах может быть 3, 2 или 1');
      }
    }
    if (userRooms === 100) {
      if (userGuests !== 0) {
        guests.setCustomValidity('100 комнат — не для гостей');
      }
    }
  };

  guests.addEventListener('change', function () {
    checkGuests(parseInt(rooms.value, 10));
  });

  rooms.addEventListener('change', function () {
    checkGuests(parseInt(rooms.value, 10));
  });

  window.form = {
    form: form,
    elementList: elementList,
    address: address,
    resetForm: resetForm,

    /**
     * Устанавливает в поля формы значения для неактивного состояния страницы
     */
    setFieldFormActiveOff: function () {
      address.value = Math.floor(window.util.pinMainStartCoords.x + window.util.PIN_MAIN_WIDTH / 2) + ', ' +
        Math.floor(window.util.pinMainStartCoords.y + window.util.PIN_MAIN_HEIGHT / 2);
      type.value = 'flat';
      type.selectedIndex = 1;
      price.placeholder = '5000';
      rooms.value = '1';
      rooms.selectedIndex = 0;
      guests.value = '3';
      guests.selectedIndex = 0;
    },

    /**
     * Устанавливает в поля формы значения для активного состояния страницы
     */
    setFieldFormActiveOn: function () {
      address.value = Math.floor(window.util.pinMainStartCoords.x + window.util.PIN_MAIN_WIDTH / 2) + ', ' +
        Math.floor(window.util.pinMainStartCoords.y + window.util.PIN_MAIN_HEIGHT_ACTIVE);
      type.value = 'flat';
      type.selectedIndex = 1;
      price.placeholder = '1000';
      price.min = 1000;
      rooms.value = '1';
      rooms.selectedIndex = 0;
      guests.value = '1';
      guests.selectedIndex = 2;
    }
  };
})();
