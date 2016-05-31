var getMessage = function(a, b) {
  var msg;

  if (typeof a == "boolean") {

    if (a) {
      msg = "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    } else {
      msg = "Переданное GIF-изображение не анимировано";
    }

  } else if (typeof a == "number") {

    msg = "Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + " атрибутов";

  } else if (Array.isArray(a)) {

    var sum = 0;

    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    }

    msg = "Количество красных точек во всех строчках изображения: " + sum;

    if (Array.isArray(b)) {

      var square = a.map(function(value, index) {
        return value + b[index];
      });

      msg = "Общая площадь артефактов сжатия: " + square + " пикселей";
    }

  }

  return msg;
}
