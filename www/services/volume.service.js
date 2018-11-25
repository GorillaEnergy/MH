;(function () {
  'use strict';

  angular
    .module('service.volumeService', [])
    .service('volumeService', volumeService);

  volumeService.$inject = ['$timeout', '$rootScope'];

  function volumeService($timeout, $rootScope) {
    let VolumeControl;
    let volume_level;
    let userArr = [];

    $rootScope.$on('video-conference-user-arr', function (e, data) {
      console.log('$rootScope.$on', data);
      userArr = data;
      change(userArr, volume_level, true);
    });

    let model = {};

    model.init = init;

    return model;

    function init() {
      try {
          VolumeControl = cordova.plugins.VolumeControl;
          if (ionic.Platform.platform() === 'android') {
              console.log('ionic.Platform.platform() === \'android\'');
              detectVolumeLevel();
              document.addEventListener("volumedownbutton", onVolumeDown);
              document.addEventListener("volumeupbutton", onVolumeUp);
          }
      } catch(e){
        console.log('Running on browser!');
      }
    }

    function onVolumeDown() {
      detectVolumeLevel('decrease')
    }
    function onVolumeUp() {
      detectVolumeLevel('increase')
    }


    function detectVolumeLevel(type) {
      window.androidVolume.getMusic(success, error);
      function success(level) {
        setLocalLevel(level);
        if (type === 'increase') {
          increaseVolume();
        } else if (type === 'decrease') {
          decreaseVolume();
        }
      }

      function error(err) {
        console.log(err);
      }
    }

    function setLocalLevel(volume) {
      volume_level = Number(volume);
    }

    function increaseVolume() {

      if (volume_level > 90 && volume_level < 100) {
        change(userArr, 100);
      } else if (volume_level < 90) {
        change(userArr, volume_level + 10);
      }
    }

    function decreaseVolume() {

      if (volume_level > 0 && volume_level < 10) {
        change(userArr, 0);
      } else if (volume_level > 0) {
        change(userArr, volume_level - 10);
      }
    }

    function change(arr, volume, hide_toast) {
      console.log(arr);
      // window.androidVolume.setMusic(volume, true, success, error);
      let show_level;
      hide_toast ? show_level = false : show_level = true ;
      window.androidVolume.setMusic(volume, show_level, success, error);

      function success(level) { setLocalLevel(level); }
      function error(err) { console.log(err); }

      for (let i = 0; i < arr.length; i++) {
        $('*[data-number="'+arr[i].user+'"]')[0].volume = volume / 100;
      }
    }

  }
})();
